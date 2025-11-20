# Airbnb Clone Backend - Planning and Workflow

## Overview
This document outlines the detailed step-by-step plan for building a basic Airbnb clone API using Express.js, focusing on learning Express.js, JWT authentication, and MongoDB. The project includes minimal views (home, error, API docs) styled with Tailwind CSS, with the main frontend handled by Next.js.

## Current Status
- ✅ Project skeleton set up with Express.js, MongoDB (Mongoose), Docker
- ✅ Basic folder structure (controllers, models, routes, etc.)
- ✅ Environment configuration (.env)
- ✅ Package.json with dependencies
- ⏳ Views setup (EJS + Tailwind) - Not started
- ⏳ JWT Authentication - Not started
- ⏳ Listings CRUD - Not started
- ⏳ Bookings system - Not started
- ⏳ Testing setup - Not started
- ⏳ API Documentation - Not started

## Detailed Step-by-Step Plan

### Phase 1: Setup and Views (Foundation)
1. **Install view dependencies**: Add EJS and Tailwind CSS to package.json
2. **Configure EJS in app.js**: Set view engine, static files for Tailwind
3. **Create basic views**:
   - `views/index.ejs`: Home page with welcome message and links
   - `views/error.ejs`: Error page for 404/500 with Tailwind styling
   - `views/docs.ejs`: API documentation page (initially manual, later auto-generated)
4. **Update routes**: Add routes for home (/) and error handling
5. **Test views**: Ensure pages render correctly with Tailwind styles

### Phase 2: Authentication System
6. **Install auth dependencies**: Add bcryptjs, jsonwebtoken, joi for validation
7. **Create User model**: Define schema in `src/models/User.js` with email, password, name, etc.
8. **Create auth controller**: Implement register, login functions in `src/controllers/authController.js`
9. **Create auth routes**: Set up `/api/auth/register` and `/api/auth/login` in `src/routes/auth.js`
10. **Add JWT middleware**: Create `src/middlewares/auth.js` for protecting routes
11. **Test authentication**: Manual testing with Postman, verify tokens

### Phase 3: Listings CRUD
12. **Create Listing model**: Define schema in `src/models/Listing.js` with title, description, price, location, etc.
13. **Create listing controller**: Implement CRUD operations in `src/controllers/listingController.js`
14. **Create listing routes**: Set up `/api/listings` endpoints (GET, POST, PUT, DELETE) in `src/routes/listings.js`
15. **Add validation**: Use Joi for input validation in controllers
16. **Test listings**: CRUD operations, ensure auth protection where needed

### Phase 4: Bookings System
17. **Create Booking model**: Define schema in `src/models/Booking.js` linking users and listings with dates
18. **Create booking controller**: Implement create, view, cancel bookings in `src/controllers/bookingController.js`
19. **Create booking routes**: Set up `/api/bookings` endpoints with auth middleware
20. **Add business logic**: Check availability, prevent double-bookings in services
21. **Test bookings**: Full booking flow, conflict resolution

### Phase 5: Testing and Documentation
22. **Setup testing framework**: Install Jest, Supertest; create `tests/` folder
23. **Write unit tests**: Test models, controllers, middleware
24. **Write integration tests**: Test full API endpoints
25. **Setup API documentation**: Install Swagger; configure in `src/routes/docs.js`
26. **Generate docs**: Auto-document all API endpoints with examples
27. **Update views**: Integrate Swagger UI into docs page

### Phase 6: Finalization and Deployment Prep
28. **Add error handling**: Enhance middleware for better error responses
29. **Add logging**: Implement Morgan for request logging
30. **Security enhancements**: Add Helmet, CORS, rate limiting
31. **Environment configs**: Separate dev/prod configs
32. **Final testing**: Run full test suite, manual QA
33. **Documentation**: Update README, API docs, deployment guide

## Workflow Guidelines
- **Daily Workflow**: Start with `pnpm run dev`, check MongoDB with `docker-compose up`
- **Testing**: Manual test with Postman first, then automate
- **Commits**: Commit after each phase completion
- **Learning Focus**: Spend time understanding each concept before moving to next
- **Time Management**: Allocate 1-2 hours per phase to avoid burnout

## Dependencies to Install
- Views: ejs, tailwindcss
- Auth: bcryptjs, jsonwebtoken, joi
- Testing: jest, supertest
- Docs: swagger-ui-express, swagger-jsdoc

## Next Steps
Begin with Phase 1: Setup views and dependencies. Update this document as progress is made.