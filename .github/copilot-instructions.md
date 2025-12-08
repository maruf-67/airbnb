# Copilot Instructions for Airbnb Clone Backend

## Architecture Overview
This is an Express.js backend API for an Airbnb clone, using MongoDB with Mongoose for data persistence. The app follows a **feature-based modular structure** with separation of concerns:

- **Entry Point**: `src/app.js` - Sets up Express server, middleware, routes, view engine (EJS), and global error handling
- **Modules**: `src/modules/` - Feature-based modules (e.g., `auth/`) containing controller, service, schema, routes, and models
- **Common**: `src/common/` - Shared utilities and middlewares
  - `common/utils/` - `catchAsync.js`, `AppError.js`, `pathUtils.js`
  - `common/middlewares/` - `validate.js`, `errorHandler.js`, `auth.js`
- **Routes**: `src/routes/index.js` - Central router mounting point for all module routes
- **Views**: `src/views/` - EJS templates for home, error, and docs pages with Tailwind CSS
- **Config**: `src/config/` - Database (`db.js`) and Redis (`redis.js`) connection setup
- **Docs**: `src/docs/` - Planning, workflow, and database design documentation

**Data flow**: Request → Route → Validation Middleware → Controller → Service → Model → Database

## Key Patterns & Conventions
- **ES Modules**: Use `import/export` syntax (configured in `package.json`)
- **Environment Variables**: Load via `dotenv` in `src/app.js`, store in `.env`
- **Database**: Connect using Mongoose in `src/config/db.js` with `MONGO_URI`
- **Feature Modules**: Group by feature (e.g., `modules/auth/`) containing:
  - `*.schema.js` - Zod validation schemas with OpenAPI metadata
  - `*.service.js` - Business logic (DB operations, no req/res)
  - `*.controller.js` - HTTP handlers (thin, delegates to service)
  - `*.routes.js` - Route definitions with validation middleware
  - `*.model.js` - Mongoose models (if feature-specific)
- **Validation Patterns**:
  - Use regex for email validation: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
  - Strong password requirements: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/`
  - Define common regex patterns at the top of schema files
  - Use Zod transforms for input normalization (lowercase, trim, etc.)
- **Database Optimization**:
  - Email field indexed for fast lookups
  - Password field excluded from queries by default (`select: false`)
  - Pre-save hooks for data normalization
- **Security**:
  - Bcrypt with cost factor 12 for password hashing
  - JWT tokens with configurable expiration (default: 7d)
  - Input sanitization and validation at multiple layers
  - Consider rate limiting for auth endpoints (login/register)
- **Error Handling**: 
  - Use `catchAsync` wrapper to eliminate try/catch blocks
  - Throw `AppError` for operational errors (404, 401, 403, etc.)
  - Global error handler in `common/middlewares/errorHandler.js` handles Zod, Mongo, and custom errors
- **Validation**: Use `validate` middleware with Zod schemas (auto-forwards errors to global handler)
- **Response Utilities**: Use `sendSuccess()` from `common/utils/response.js` for consistent API responses
  - `sendSuccess(res, data)` - 200 OK
  - `sendSuccess(res, data, 'Message')` - 200 with message
  - `sendSuccess(res, data, 'Created', 201)` - 201 Created
- **Path Management**: Use `common/utils/pathUtils.js` for all directory resolutions
- **API Routes**: Prefix with `/api/` (e.g., `/api/auth/login`)
- **Authentication**: JWT tokens with bcrypt, `authenticateToken` and `authorizeRoles` middlewares

## Developer Workflows
- **Install Dependencies**: `pnpm install`
- **Build CSS**: `pnpm run build:css` (compiles Tailwind CSS)
- **Start Development Server**: `pnpm run dev` (uses nodemon for auto-reload)
- **Start Production Server**: `pnpm start`
- **Database Setup**:
  - Start MongoDB: `sudo systemctl start mongod`
  - Check status: `sudo systemctl status mongod`
  - Ensure MongoDB is running on `127.0.0.1:27017` before starting the app

## Adding Features
1. Create a new module folder in `src/modules/` (e.g., `modules/properties/`)
2. Add files:
   - `properties.schema.js` - Zod validation schemas
   - `properties.model.js` - Mongoose model
   - `properties.service.js` - Business logic (uses `AppError` for errors)
   - `properties.controller.js` - Controllers (use `catchAsync` wrapper)
   - `properties.routes.js` - Routes with `validate` middleware
3. Mount routes in `src/routes/index.js`: `router.use('/api/properties', propertiesRouter);`

**Example Module Structure**:
```javascript
// modules/properties/properties.schema.js
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Common regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const CreatePropertySchema = z.object({
  title: z.string().min(5).max(100),
  price: z.number().positive(),
  contactEmail: z.string().regex(EMAIL_REGEX, 'Invalid email address'),
});

// modules/properties/properties.service.js
import { AppError } from '../../common/utils/AppError.js';
import Property from './properties.model.js';

export const createProperty = async (data, userId) => {
  if (!userId) throw new AppError('User not authenticated', 401);
  const property = await Property.create({ ...data, owner: userId });
  return property;
};

// modules/properties/properties.controller.js
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as PropertyService from './properties.service.js';

export const create = catchAsync(async (req, res) => {
  const property = await PropertyService.createProperty(req.body, req.user.id);
  sendSuccess(res, property, 'Property created successfully', 201);
});

// modules/properties/properties.routes.js
import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.js';
import { authenticateToken } from '../../common/middlewares/auth.js';
import * as Controller from './properties.controller.js';
import { CreatePropertySchema } from './properties.schema.js';

const router = Router();
router.post('/', authenticateToken, validate(CreatePropertySchema), Controller.create);
export default router;
```