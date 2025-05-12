# eSports Management Backend

Backend for the eSports management application developed with Node.js, Express, and Prisma.

## Architecture

This project follows a hexagonal architecture (ports and adapters) that separates business logic from infrastructure:

- **Domain**: Contains business entities and repository interfaces
- **Application**: Contains application use cases
- **Infrastructure**: Contains concrete implementations (controllers, repositories, middleware, etc.)

## Prerequisites

- Node.js 20.x or higher
- MariaDB/MySQL
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
npm install
```

3. Configure the `.env` file with your environment variables (use `.env.example` as a reference)
4. Configure the database:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

## Execution

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

## Development

### Available Scripts

- `npm start` - Starts the server in production mode
- `npm run dev` - Starts the server in development mode with hot-reload
- `npm run lint` - Runs ESLint to check code quality
- `npm run test` - Runs tests
- `npm run db:migrate` - Runs database migrations
- `npm run db:generate` - Generates Prisma client based on schema

## Security

The backend implements the following security measures:

- Cookie-based authentication (httpOnly)
- Passwords encrypted with bcrypt
- CSRF protection
- Data validation with Joi
- Security headers with Helmet
- Rate limiting
- Secure CORS configuration 