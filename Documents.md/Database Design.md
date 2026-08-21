# Database Design

## Overview
The Task Management System utilizes **MongoDB** as its primary document database.

## Database Name
`task_management`

## Collections

### 1. `users`
Stores user profile and authentication credentials.

#### Schema Definition: User
- `name`: `String` (Required, Trimmed)
- `email`: `String` (Required, Unique, Lowercase, Trimmed)
- `password`: `String` (Required)
- `timestamps`: `true` (`createdAt`, `updatedAt`)

### 2. `tasks`
Stores task items belonging to authenticated users.

#### Schema Definition: Task
- `user`: `Schema.Types.ObjectId` (Required, Ref: `'User'`, Indexed)
- `title`: `String` (Required, Trimmed)
- `description`: `String` (Optional, Trimmed, Default: `""`)
- `status`: `String` (Enum: `['pending', 'in-progress', 'completed']`, Default: `'pending'`)
- `priority`: `String` (Enum: `['low', 'medium', 'high']`, Default: `'medium'`)
- `dueDate`: `Date` (Optional)
- `timestamps`: `true` (`createdAt`, `updatedAt`)

## Connection
The application connects to MongoDB using **Mongoose** via the `MONGODB_URI` environment variable.
