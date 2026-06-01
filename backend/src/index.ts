import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Property } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use the raw postgres URL from prisma dev output
const connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'LvivStay backend is running' });
});

// Get all properties (with optional date availability filter)
app.get('/api/properties', async (req: Request, res: Response<Property[] | { error: string }>) => {
  try {
    const { startDate, endDate } = req.query;
    
    // If dates are provided, filter out properties that are booked during those dates
    let whereClause = {};
    if (startDate && endDate) {
      whereClause = {
        bookings: {
          none: {
            AND: [
              { startDate: { lt: new Date(endDate as string) } },
              { endDate: { gt: new Date(startDate as string) } },
            ]
          }
        }
      };
    }
    
    const properties = await prisma.property.findMany({
      where: whereClause,
    });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
app.get('/api/properties/:id', async (req: Request<{ id: string }>, res: Response<Property | { error: string }>) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
    });
    
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    
    res.json(property);
  } catch (error) {
    console.error(`Error fetching property ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Auth Routes

// Register a new user
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'GUEST',
      },
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
