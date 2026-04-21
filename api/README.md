# CircleHub API

Production-ready Express API starter with MongoDB (Mongoose), TypeScript, linting, and environment validation.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- TypeScript
- ESLint (flat config)
- Zod for environment variable validation

## Quick Start

1. Install dependencies:

   npm install

2. Create environment file:

   Copy `.env.example` to `.env` and update values.

3. Run in development:

   npm run dev

4. Build and run production:

   npm run build
   npm start

## Scripts

- `npm run dev` - Start dev server with watch mode
- `npm run check` - Type check without build
- `npm run lint` - Run ESLint
- `npm run build` - Compile TypeScript to `dist/`
- `npm start` - Run compiled server

## API Base

- Base path: `/api/v1`
- Health endpoint: `GET /api/v1/health`

## Recommended Next Steps

- Add domain modules (controllers, services, models) for your app features
- Add request validation middleware for all write endpoints
- Add centralized async wrapper and custom error classes per domain
- Add unit/integration tests (Jest or Vitest + Supertest)
