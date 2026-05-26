import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Property } from '@prisma/client';

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
