# Copilot Instructions for Airbnb Clone Backend

## Architecture Overview
This is an **Express.js + TypeScript** backend API for an Airbnb clone, using MongoDB with Mongoose for data persistence. The app follows a **feature-based modular structure** with separation of concerns:

- **Entry Point**: `src/app.ts` - Sets up Express server, middleware, routes, view engine (EJS for legacy/docs), and global error handling
- **Modules**: `src/modules/` - Feature-based modules (e.g., `auth/`, `posts/`) containing controller, service, schema, routes, and models
- **Common**: `src/common/` - Shared utilities and middlewares
  - `common/utils/` - `catchAsync.ts`, `AppError.ts`, `pathUtils.ts`
  - `common/middlewares/` - `validate.ts`, `errorHandler.ts`, `auth.ts`
- **Routes**: `src/routes/index.ts` - Central router mounting point for all module routes
- **Views**: `src/views/` - EJS templates for simple pages (error, docs)
- **Config**: `src/config/` - Database (`db.ts`) and Redis (`redis.ts`) connection setup
- **Docs**: `src/docs/` - Planning, workflow, and database design documentation

**Data flow**: Request → Route → Validation Middleware → Controller → Service → Model → Database

## Key Patterns & Conventions
- **TypeScript**: Use `import/export` syntax, interfaces for Request/Response, and Zod type inference.
- **Environment Variables**: Load via `dotenv` in `src/app.ts`, store in `.env`.
- **Database**: Connect using Mongoose in `src/config/db.ts` with `MONGO_URI`.
- **Feature Modules**: Group by feature (e.g., `modules/auth/`) containing:
  - `*.schema.ts` - Zod validation schemas with OpenAPI metadata
  - `*.service.ts` - Business logic (DB operations, no req/res)
  - `*.controller.ts` - HTTP handlers (thin, delegates to service)
  - `*.routes.ts` - Route definitions with validation middleware
  - `*.model.ts` - Mongoose models (if feature-specific)
- **Validation Patterns**:
  - Use regex for email validation
  - Strong password requirements
  - Use Zod transforms for input normalization (lowercase, trim, etc.)
- **Error Handling**: 
  - Use `catchAsync` wrapper to eliminate try/catch blocks
  - Throw `AppError` for operational errors (404, 401, 403, etc.)
  - Global error handler handles Zod, Mongo, and custom errors
- **Response Utilities**: Use `sendSuccess()` for consistent API responses
- **API Routes**: Prefix with `/api/` (e.g., `/api/auth/login`)
- **Authentication**: JWT tokens with bcrypt, `authenticateToken` middleware

## Developer Workflows
- **Install Dependencies**: `pnpm install`
- **Run Dev Server**: `pnpm run dev` (uses `tsx` + `nodemon`)
- **Build**: `pnpm run build` (tsc)
- **Type Check**: `pnpm run type-check`

## Adding Features
1. Create a new module folder in `src/modules/` (e.g., `modules/posts/`)
2. Add files:
   - `post.schema.ts` - Zod schemas
   - `post.model.ts` - Mongoose model
   - `post.service.ts` - Business logic
   - `post.controller.ts` - Controllers
   - `post.routes.ts` - Routes
3. Mount routes in `src/routes/index.ts`

**Example Module Structure**:
```typescript
// modules/posts/post.schema.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreatePostSchema = z.object({
  title: z.string().min(5).max(100),
  price: z.number().positive(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

// modules/posts/post.service.ts
import { AppError } from '../../common/utils/AppError.js';
import Post from './post.model.js';
import { CreatePostInput } from './post.schema.js';

export const createPost = async (data: CreatePostInput, userId: string) => {
  const post = await Post.create({ ...data, owner: userId });
  return post;
};

// modules/posts/post.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync.js';
import { sendSuccess } from '../../common/utils/response.js';
import * as postService from './post.service.js';

export const create = catchAsync(async (req: Request, res: Response) => {
  // req.user is added by auth middleware
  const post = await postService.createPost(req.body, (req as any).user.id);
  sendSuccess(res, post, 'Post created successfully', 201);
});

// modules/posts/post.routes.ts
import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.js';
import { authenticateToken } from '../../common/middlewares/auth.js';
import * as Controller from './post.controller.js';
import { CreatePostSchema } from './post.schema.js';

const router = Router();
router.post('/', authenticateToken, validate(CreatePostSchema), Controller.create);
export default router;
```