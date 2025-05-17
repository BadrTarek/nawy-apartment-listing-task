# Nawy Apartment Listing Task

## Overview
A modern full-stack application for managing apartment listings, built with TypeScript and containerized with Docker. The application features a Next.js frontend for a responsive user interface and a Node.js backend with PostgreSQL for data persistence and Redis for caching.

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL with TypeORM
- Redis for caching
- Class-based architecture with dependency injection (tsyringe)
- Jest for testing
- Input validation with class-validator and zod
- File upload handling with Multer

### Frontend
- Next.js 15.3.2
- React 19
- TypeScript
- TailwindCSS
- Lucide icons
- ESLint

### Infrastructure
- Docker and Docker Compose
- PostgreSQL 15
- Redis 7
- Automated testing
- Migration system

## Prerequisites
- Docker and Docker Compose
- Node.js 18 or higher (for local development)
- yarn or npm

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nawy-apartment-listing-task.git
cd nawy-apartment-listing-task
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3300
- PostgreSQL: localhost:5555
- Redis: localhost:6666

### Local Development Setup

#### Backend
```bash
cd backend
yarn install
yarn dev
```

#### Frontend
```bash
cd frontend
yarn install
yarn dev
```



## Environment Variables

### Backend
```env
# Database
DB_HOST=postgres
DB_PORT=5555
DB_USERNAME=nawy
DB_PASSWORD=nawy123
DB_NAME=nawy_apartments

# Redis
REDIS_HOST=redis
REDIS_PORT=6666
REDIS_PASSWORD=nawy123
REDIS_KEY_PREFIX=nawy

# Server
SERVER_URL=http://localhost:3300
SERVER_UPLOADS_PATH=uploads
SERVER_PORT=3300
```

### Frontend
```env
API_BASE_URL=http://localhost:3300
```

## Database Migrations

Run database migrations:
```bash
cd backend
yarn migration:run
```

Generate new migration:
```bash
yarn migration:generate src/migrations/MigrationName
```

## Testing

### Backend Tests
```bash
cd backend
yarn test
# or with coverage
yarn test:coverage
```
