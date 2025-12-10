---
trigger: always_on
---

You are an expert full-stack developer working on an Airbnb clone project. The project consists of two workspaces:
1. **Backend**: Express.js + Mongoose (`airbnb-express`)
2. **Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 (`airbnb-front`)

You MUST follow these rules when working on this project.

## 1. General Principles
- **Conciseness**: Be concise in explanations. Focus on code.
- **Paths**: ALWAYS use absolute paths.
- **Package Manager**: Use `pnpm` for all dependency management.

## 2. Backend Rules (Express.js)
**Architecture**: Feature-based modular structure in `src/modules/`.
- **Files**:
  - `*.schema.js`: Zod schemas (use `extendZodWithOpenApi`).
  - `*.service.js`: Business logic (DB interactions).
  - `*.controller.js`: HTTP handlers (use `catchAsync`).
  - `*.routes.js`: Route definitions.
  - `*.model.js`: Mongoose models.

**Coding Standards**:
- **Imports**: Use ES Modules (`import/export`).
- **Error Handling**:
  - NEVER use `try/catch` in controllers. Wrap them with `catchAsync`.
  - Throw operational errors using `new AppError(message, statusCode)`.
- **Validation**:
  - Use `validate(Schema)` middleware for all input routes.
  - Define regex patterns (e.g., for email/passwords) in schema files.
- **Responses**:
  - Use `sendSuccess(res, data, message, statusCode)` from `common/utils/response.js`.
- **Auth**:
  - Protect routes with `authenticateToken`.
  - Get user info from `req.user`.

**File Placement**:
- Universal utils -> `src/common/utils/`
- Universal middlewares -> `src/common/middlewares/`
- Feature-specific code -> `src/modules/<feature>/`

## 3. Frontend Rules (Next.js)
**Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4.

**Architecture**:
- **Pages**: `src/app/`
- **Components**: `src/components/` (Functional, reusable, pixel-perfect).

**Design & Styling**:
- **Aesthetics**: "Pixel-perfect", premium design fidelity tailored to match Figma.
- **Tailwind**: Use v4 syntax.
- **Assets**: Use `next/image` for images.
- **Fonts**: Use `Inter` (Google Fonts).

**Conventions**:
- **Components**: PascalCase filenames (e.g., `AirbnbNav.tsx`).
- **Structure**: Keep components small and focused.
- **Icons**: Use SVG icons (e.g., Heroicons or custom SVGs) as separate components or inline if simple.

## 4. Workflow
- When adding a backend feature, created the full module structure: schema -> model -> service -> controller -> routes.
- When adding a frontend component, ensure it is responsive and matches the design tokens (colors, spacing).
