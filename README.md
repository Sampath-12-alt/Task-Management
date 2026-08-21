# Task Management System

## Overview
The **Task Management System** is a full-stack web application designed for individual productivity and task tracking. 

Key functionality includes:
- **User Authentication**: Secure user registration and login with JWT authentication.
- **Data Privacy & Scoping**: Each user can view, edit, and manage only their own tasks.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) along with status updates.
- **Search, Filter & Sorting**: Search tasks by title, filter by status or priority, sort by date/title, and navigate paginated results.
- **Analytics & Productivity Insights**: Visual breakdown of task counts, completion percentages, status distribution, and priority metrics.

## Features

### Authentication
- User signup (`/api/auth/signup`)
- User login (`/api/auth/login`)
- JWT authentication (`Bearer` token)
- Password hashing with `bcryptjs`
- User-specific data isolation

### Task Management
- Create task (title, description, status, priority, due date)
- View paginated task list
- View single task details
- Update task details
- Update task status (Pending, In Progress, Completed)
- Delete task with confirmation
- Search tasks by title (case-insensitive keyword matching)
- Filter by status (`pending`, `in-progress`, `completed`)
- Filter by priority (`low`, `medium`, `high`)
- Sorting by `createdAt`, `dueDate`, `title`, or `priority` (`asc` / `desc`)
- Pagination with customizable page size and page navigation

### Analytics
- Total tasks count
- Completed tasks count & percentage
- Pending tasks count & percentage
- In-progress tasks count & percentage
- Visual status breakdown (donut chart widget)
- Visual priority distribution (progress bar widget)

### UI
- Clean, responsive SaaS interface with resizable sidebar
- Dark mode (primary default) and Light mode theme support
- Loading spinners and asynchronous submission feedback
- Field-level validation and dismissible error alert banners
- Empty state containers with actionable triggers

## Tech Stack

### Frontend
- **React** (v18)
- **Vite** (v5)
- **React Router DOM** (v7)
- **Vanilla CSS** with CSS Custom Properties / Design Tokens

### Backend
- **Node.js** (v18+ / v20+)
- **Express.js** (v4)
- **Mongoose** (v9)
- **Cors**
- **Dotenv**

### Database
- **MongoDB**

### Authentication
- **JSON Web Tokens (jsonwebtoken)**
- **bcryptjs**

## Project Structure

```text
Task Management/
├── backend/            # Express server, Mongoose models, controllers, middleware, routes
├── frontend/           # React application, Vite build system, pages, components, CSS tokens
├── Documents.md/       # Architectural docs (Requirements, API Specs, Database Design, Architecture)
├── README.md           # Project documentation
└── .gitignore          # Repository git ignore rules
```

- `backend/`: Contains the REST API server built with Node.js, Express, Mongoose, and JWT authentication middleware.
- `frontend/`: Contains the React single-page application built with Vite and pure CSS tokens.
- `Documents.md/`: Contains technical documentation for the system.

## Database

### Users Collection (`users`)
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `password` (String, required, hashed with bcrypt)
- `createdAt` / `updatedAt` (Timestamps)

### Tasks Collection (`tasks`)
- `user` (ObjectId referencing `User`, required, indexed)
- `title` (String, required, trimmed, indexed)
- `description` (String, optional)
- `status` (String, enum: `['pending', 'in-progress', 'completed']`, default: `'pending'`, indexed)
- `priority` (String, enum: `['low', 'medium', 'high']`, default: `'medium'`, indexed)
- `dueDate` (Date, optional, indexed)
- `createdAt` / `updatedAt` (Timestamps)

**Database Ownership Scoping**: Every task record references its creator (`user` ObjectId). All task queries, updates, and deletion handlers enforce user scoping (`{ _id: taskId, user: req.user._id }`) to prevent unauthorized cross-user access.

## API Overview

### Base URL
`/api`

### Authentication Endpoints
- **`POST /api/auth/signup`**: Public. Registers a new user account with hashed password.
- **`POST /api/auth/login`**: Public. Authenticates user credentials and returns JWT token.
- **`GET /api/auth/me`**: Private. Returns current authenticated user profile.

### Task Endpoints
- **`GET /api/tasks`**: Private. Retrieves paginated, filtered, and sorted task list for the authenticated user.
- **`POST /api/tasks`**: Private. Creates a new task assigned to the authenticated user.
- **`GET /api/tasks/:id`**: Private. Retrieves a single task belonging to the authenticated user.
- **`PUT /api/tasks/:id`**: Private. Updates an existing task belonging to the authenticated user.
- **`PATCH /api/tasks/:id/status`**: Private. Updates only the status field of a task.
- **`DELETE /api/tasks/:id`**: Private. Deletes a task belonging to the authenticated user.

### Analytics Endpoints
- **`GET /api/tasks/analytics`**: Private. Computes aggregate task metrics and breakdown statistics for the authenticated user.

## Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
- **npm** (v9.0.0 or higher)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Required `.env` variables:
   - `PORT`: Server port (configured as `5001`)
   - `NODE_ENV`: Runtime environment (`development` or `production`)
   - `MONGODB_URI`: MongoDB connection string (`mongodb://127.0.0.1:27017/task_management`)
   - `JWT_SECRET`: Secret key used for signing JWT tokens
   - `JWT_EXPIRES_IN`: Token expiration duration (`30d`)

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5001`.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables (optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - `VITE_API_URL`: Backend API base URL (default: `http://localhost:5001`)

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend development server will run on `http://localhost:3000`.*

## Running the Application

1. Ensure **MongoDB** daemon is running on your machine.
2. Start the backend server (`cd backend && npm run dev`).
3. Start the frontend client (`cd frontend && npm run dev`).
4. Open your browser and visit `http://localhost:3000`.

## Testing & Verification

The project includes verified test suites covering:
- **Authentication**: Verified user signup, login, JWT token generation, and password verification.
- **Task CRUD Operations**: Verified creation, reading, updating, status toggling, and deletion.
- **Search, Filtering, Sorting & Pagination**: Verified title keyword search, status filtering, priority filtering, date sorting, and page limits.
- **Security & Authorization**: Verified that unauthenticated requests (missing/invalid JWT) return HTTP 401, and User A cannot read, edit, or delete User B's tasks (HTTP 404 / access denied).
- **Global Error Handling**: Verified Express error handling middleware for invalid ObjectIds and bad request payloads.

## Security

- **Password Hashing**: User passwords are salted and hashed using `bcryptjs` before database persistence.
- **JWT Protection**: All `/api/tasks` endpoints require a valid HTTP `Authorization: Bearer <token>` header.
- **Database Query Scoping**: Every database query scopes task ownership to `req.user._id` to enforce user isolation.
- **Secret Isolation**: Secrets and environment variables (`.env`) are excluded from source control via `.gitignore`.

## Design Decisions

- **Decoupled Architecture**: Strict separation between the React single-page frontend and Express REST API backend.
- **Mongoose Schemas**: MongoDB models use strict schemas with compound indexes (`user` + `status`, `user` + `priority`, `user` + `dueDate`, `user` + `createdAt`) to optimize database read query performance.
- **Vanilla CSS Tokens**: Clean CSS variable design system without external CSS framework overhead.
- **Stateless Authentication**: JWT tokens permit scalable, stateless backend request verification.

## Assignment Scope

This application strictly implements the core requirements specified in the project assignment. To maintain alignment with the specified scope, the following optional features are excluded:
- Role-Based Access Control (RBAC) / Admin Dashboards
- Teams or Multi-user Task Sharing
- External OAuth / Social Logins
- Email / Push Notifications
- Third-party Integrations

## License
MIT License
