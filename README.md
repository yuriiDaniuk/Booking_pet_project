# LvivStay MVP

LvivStay is a modern web application for booking properties, featuring a mobile-first design with a clear separation of frontend and backend.

## Technology Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL

## Project Structure
- `/frontend` - Contains the Next.js application (App Router).
- `/frontend/src/lib/api.ts` - Axios client configured to point to the backend.
- `/backend` - Contains the Express server and Prisma ORM configuration.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally, or a remote PostgreSQL database URL.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `/backend` folder based on the default Prisma setup:
   ```env
   # /backend/.env
   # Replace the URL with your actual PostgreSQL credentials
   DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
   PORT=5000
   ```

4. Prepare the database schema:
   The `schema.prisma` file is already configured with `User`, `Property`, and `Booking` models. Apply the schema to your database by running:
   ```bash
   npx prisma db push
   # Or create a formal migration:
   # npx prisma migrate dev --name init
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application Concurrently

To run both the frontend and backend at the same time, you can open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npx nodemon src/index.ts
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

> **Tip**: For a true concurrent setup from the root directory, you can create a root `package.json` with `concurrently`, but running them in separate terminals is straightforward and keeps their logs clean.

---

## Design and Features

The application embraces a **Mobile-First** approach utilizing Tailwind CSS, ensuring smooth user experiences across devices:
- **AuthLayout**: Interactive placeholder for sign in/up logic.
- **Feed**: Vertical scrollable property feed with bottom tab navigation.
- **PropertyDetails**: Detailed property views highlighting host details, reviews, and a sticky 'Book Now' action bar.
