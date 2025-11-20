# Copilot Instructions for Airbnb Clone Backend

## Architecture Overview
This is an Express.js backend API for an Airbnb clone, using MongoDB with Mongoose for data persistence. The app follows a modular structure with separation of concerns and includes minimal views for home, error, and API documentation pages styled with Tailwind CSS:

- **Entry Point**: `src/app.js` - Sets up Express server, middleware, routes, and view engine (EJS)
- **Routes**: `src/routes/index.js` - Central router mounting point for API endpoints
- **Controllers**: `src/controllers/` - Handle request/response logic (currently empty)
- **Models**: `src/models/` - Mongoose schemas and models (currently empty)
- **Services**: `src/services/` - Business logic layer (currently empty)
- **Middlewares**: `src/middlewares/` - Custom middleware functions (currently empty)
- **Utils**: `src/utils/` - Utility functions (currently empty)
- **Views**: `src/views/` - EJS templates for home, error, and docs pages with Tailwind CSS
- **Config**: `src/config/db.js` - Database connection setup
- **Docs**: `src/docs/` - Planning, workflow, and database design documentation

Data flow: Request → Route → Controller → Service/Model → Database (API) or View Rendering (Pages)

## Key Patterns & Conventions
- **ES Modules**: Use `import/export` syntax (configured in `package.json`)
- **Environment Variables**: Load via `dotenv` in `src/app.js`, store in `.env`
- **Database**: Connect using Mongoose in `src/config/db.js` with `MONGO_URI`
- **Views**: Use EJS for templating, Tailwind CSS for styling (CDN or compiled)
- **Error Handling**: Centralized in `src/app.js` with error middleware and custom error pages
- **Routes Structure**: Mount feature routes in `src/routes/index.js` (e.g., `router.use('/users', userRoutes)`)
- **API Routes**: Prefix with `/api/` (e.g., `/api/auth/login`)
- **Validation**: Use Joi for input validation in controllers
- **Authentication**: JWT tokens with bcrypt for password hashing

## Developer Workflows
- **Install Dependencies**: `pnpm install`
- **Start Development Server**: `pnpm run dev` (uses nodemon for auto-reload)
- **Start Production Server**: `pnpm start`
- **Database Setup**: `docker-compose up` to start MongoDB and Mongo Express GUI
- **Database GUI**: Access at http://localhost:8081 after starting containers
- **View Development**: Edit EJS files in `src/views/`, refresh browser for Tailwind changes

## Integration Points
- **MongoDB**: Local instance via Docker, connection string in `.env`
- **CORS/Helmet/Morgan**: Middleware commented out in `src/app.js` - uncomment as needed
- **Prisma Scripts**: `migrate` and `studio` scripts exist but unused (project uses Mongoose instead)
- **Testing**: Jest/Supertest for automated tests in `tests/` folder
- **Documentation**: Swagger/OpenAPI for API docs at `/api-docs`

## Adding Features
1. Create Mongoose model in `src/models/` (e.g., `User.js`)
2. Add controller in `src/controllers/` (e.g., `userController.js`)
3. Create route file in `src/routes/` (e.g., `users.js`)
4. Mount route in `src/routes/index.js`
5. Use services in `src/services/` for complex business logic
6. For views: Create EJS template in `src/views/`, add route in `src/routes/index.js`

Example model structure:
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  // ... other fields
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

Example controller pattern:
```javascript
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
```

Example view route:
```javascript
// In src/routes/index.js
router.get('/', (req, res) => {
  res.render('index', { title: 'Airbnb Clone' });
});
```

Example EJS view (src/views/index.ejs):
```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold">Welcome to Airbnb Clone</h1>
  </div>
</body>
</html>
```