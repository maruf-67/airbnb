# Airbnb Clone Backend

This is a robust, feature-rich backend API for an Airbnb clone, built with the **MERN stack** (specifically Node.js, Express, and MongoDB) and fully typed with **TypeScript**.

## Architecture & Design

The project follows a **feature-based modular structure**, ensuring separation of concerns and scalability. Each module (e.g., `auth`, `bookings`, `posts`) contains its own routes, controllers, services, and schemas.

### Key Architectural Patterns:
- **Service Layer Pattern**: Business logic is decoupled from controllers, making it reusable and easier to test.
- **Schema Validation**: Uses **Zod** for runtime validation and type safety, integrated with OpenAPI for documentation.
- **Global Error Handling**: A centralized error handling middleware manages operational and programming errors gracefully.
- **Authentication**: Secure **JWT-based** authentication with token blacklisting and role-based permissions.

## Tech Stack & Packages

### Core
- **Express.js (v5)**: The latest version of the fast, unopinionated web framework for Node.js.
- **TypeScript**: Provides static typing for better developer experience and fewer runtime bugs.
- **MongoDB & Mongoose**: NoSQL database with a powerful ODM for data modeling.

### Security & Authentication
- **jsonwebtoken**: For generating and verifying stateless authentication tokens.
- **bcryptjs**: Secure password hashing.
- **helmet**: Enhances API security by setting various HTTP headers.
- **cors**: Enables Cross-Origin Resource Sharing for the frontend.

### Utilities & Validation
- **Zod**: TypeScript-first schema declaration and validation.
- **Multer**: Middleware for handling `multipart/form-data`, used for property and avatar uploads.
- **dotenv**: Manages environment variables.
- **morgan**: HTTP request logger for development.
- **ejs**: Used for rendering dynamic documentation and error pages.

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Environment Variables**: Create a `.env` file based on `.env.example` (if available) and provide your `MONGO_URI`, `JWT_SECRET`, etc.
4. **Seed the Database**:
   ```bash
   pnpm run seed
   ```
5. **Run Development Server**:
   ```bash
   pnpm run dev
   ```

## API Documentation

The API documentation is automatically generated and can be accessed at `/api/docs` when the server is running.

## Related Repositories

- **Frontend**: [https://github.com/maruf-67/airbnb-front](https://github.com/maruf-67/airbnb-front)