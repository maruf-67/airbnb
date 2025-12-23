# Airbnb Clone - Planning and Workflow

## Overview
This document outlines the development plan for the Airbnb clone, consisting of a **TypeScript Express.js Backend** and a **Next.js 16 Frontend**.

## Tech Stack
- **Backend**: Express.js, TypeScript, MongoDB (Mongoose), Redis (Caching), Zod (Validation).
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Heroicons.
- **Tools**: Docker, ESLint, Prettier, Postman.

## Current Status

### Backend (`airbnb-express`)
- ✅ **Setup**: TypeScript + Express configured (`tsconfig.json`, `package.json`).
- ✅ **Modules Implemented**:
  - `auth`: Registration, Login (JWT).
  - `users`: User management.
  - `role`: Role-based access control (RBAC).
  - `posts`: Listings management (renamed from Listings to Posts).
  - `pricing`: Pricing logic.
- ✅ **Docs**: API Docs partially set up.
- ⏳ **Bookings**: Not started.
- ⏳ **Reviews**: Not started.
- ⏳ **Tests**: Unit/Integration tests pending.

### Frontend (`airbnb-front`)
- ✅ **Setup**: Next.js 16 + Tailwind v4 initialized.
- ✅ **Structure**:
  - `(public)`: Home page (`page.tsx`) fetching posts.
  - `(admin)`: Admin panel structure.
- ✅ **Components**: `ListingCard`, `AirbnbNav`, `AirbnbSearch`, `AdminSidebar`.
- ⏳ **Integrations**: Full Auth integration, Booking flow, User Dashboard.

## Detailed Step-by-Step Plan

### Phase 1: Foundation (Completed)
- [x] Project skeletons (Backend & Frontend).
- [x] Database connection (MongoDB, Redis).
- [x] Basic Views/Routes setup.

### Phase 2: Core Backend Features (Mostly Completed)
- [x] **Auth Module**: JWT, Bcrypt, Middleware.
- [x] **RBAC**: Role management.
- [x] **Posts (Listings)**: CRUD operations (`post.controller.ts`).
- [ ] **Bookings**: Implement booking logic and collision detection.
- [ ] **Reviews**: Add review schema and controllers.

### Phase 3: Frontend Implementation (In Progress)
- [x] **Home Page**: Display listings from API.
- [ ] **Auth Pages**: Login/Register UI integration with Backend.
- [ ] **Listing Details**: Single post view with images and map.
- [ ] **Booking Flow**: UI for selecting dates and guests.
- [ ] **Admin Panel**: Manage users, posts, and bookings.

### Phase 4: Advanced Features & Polish
- [ ] **Search & Filters**: Advanced querying (Location, Price, Amenities).
- [ ] **Image Upload**: S3 or local upload handling.
- [ ] **Payment**: Stripe/PayPal mock integration.

### Phase 5: Testing & Deployment
- [ ] **Backend Tests**: Jest + Supertest.
- [ ] **Frontend Tests**: React Testing Library / Playwright.
- [ ] **CI/CD**: GitHub Actions.
- [ ] **Deployment**: Vercel (Frontend) + VPS/Cloud (Backend).

## Workflow Guidelines
- **Language**: Use **TypeScript** for both Backend and Frontend.
- **Backend**: Follow feature-based module structure (`src/modules/*`).
- **Frontend**: Use server components where possible, client components for interactivity.
- **Commits**: Conventional Commits (e.g., `feat: add booking module`).

## Dependencies
- **Backend**: `express`, `mongoose`, `zod`, `jsonwebtoken`, `bcryptjs`, `@asteasolutions/zod-to-openapi`.
- **Frontend**: `next`, `react`, `tailwindcss`, `axios`/`fetch`.