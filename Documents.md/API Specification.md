# API Specification

## Base URL
`/api`

## Authentication Specification
Protected endpoints require a Bearer JWT token sent in the `Authorization` header:
`Authorization: Bearer <jwt_token>`

### Unauthorized Error Responses
- **401 Unauthorized** (No token provided):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```
- **401 Unauthorized** (Invalid or expired token):
  ```json
  {
    "message": "Not authorized, token failed"
  }
  ```

---

## Authentication Endpoints

### 1. Register User (Signup)
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Access**: Public

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d5ec49f1b2c817a8e8f1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-20T04:30:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing required fields):
  ```json
  {
    "message": "Please provide name, email, and password"
  }
  ```
- **400 Bad Request** (Email already registered):
  ```json
  {
    "message": "User already exists with this email"
  }
  ```

---

### 2. Authenticate User (Login)
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Access**: Public

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "_id": "60d5ec49f1b2c817a8e8f1a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing email or password):
  ```json
  {
    "message": "Please provide email and password"
  }
  ```
- **401 Unauthorized** (Invalid email or password):
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### 3. Get Current User Profile (Me)
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Access**: Private (Requires Bearer Token)

#### Success Response (200 OK)
```json
{
  "user": {
    "_id": "60d5ec49f1b2c817a8e8f1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-20T04:30:00.000Z"
  }
}
```

---

## Task Endpoints

### 1. Create Task
- **Method**: `POST`
- **Path**: `/api/tasks`
- **Access**: Private (Requires Bearer Token)

#### Request Body
```json
{
  "title": "Complete Project Documentation",
  "description": "Write and review all architectural documents",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-08-30T00:00:00.000Z"
}
```

#### Success Response (201 Created)
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "60d5ec49f1b2c817a8e8f1a2",
    "user": "60d5ec49f1b2c817a8e8f1a1",
    "title": "Complete Project Documentation",
    "description": "Write and review all architectural documents",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-08-30T00:00:00.000Z",
    "createdAt": "2026-08-20T06:00:00.000Z",
    "updatedAt": "2026-08-20T06:00:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing required title):
  ```json
  {
    "message": "Please provide a task title"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 2. Get User Tasks (with Search, Filtering, Sorting & Pagination)
- **Method**: `GET`
- **Path**: `/api/tasks`
- **Access**: Private (Requires Bearer Token)

#### Query Parameters
- `search` or `title` (optional): Case-insensitive keyword to filter tasks by title. E.g., `/api/tasks?search=Doc`
- `status` (optional): Filter tasks by status (`pending`, `in-progress`, `completed`). E.g., `/api/tasks?status=pending`
- `priority` (optional): Filter tasks by priority (`low`, `medium`, `high`). E.g., `/api/tasks?priority=high`
- `sortBy` or `sort` (optional): Field to sort tasks by (`dueDate`, `createdAt`, `priority`, `title`). Default: `createdAt`. E.g., `/api/tasks?sortBy=dueDate`
- `order` or `direction` (optional): Sorting direction (`asc` or `desc`). Default: `desc`. E.g., `/api/tasks?order=asc`
- `page` (optional): Page number (integer >= 1). Default: `1`. E.g., `/api/tasks?page=2`
- `limit` (optional): Items per page (integer >= 1). Default: `10`. E.g., `/api/tasks?limit=5`

#### Success Response (200 OK)
```json
{
  "tasks": [
    {
      "_id": "60d5ec49f1b2c817a8e8f1a2",
      "user": "60d5ec49f1b2c817a8e8f1a1",
      "title": "Complete Project Documentation",
      "description": "Write and review all architectural documents",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-08-30T00:00:00.000Z",
      "createdAt": "2026-08-20T06:00:00.000Z",
      "updatedAt": "2026-08-20T06:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Error Responses
- **400 Bad Request** (Invalid filter, sort, or pagination parameter):
  ```json
  {
    "message": "Invalid page number"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 3. Get Single Task
- **Method**: `GET`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Requires Bearer Token)

#### Success Response (200 OK)
```json
{
  "task": {
    "_id": "60d5ec49f1b2c817a8e8f1a2",
    "user": "60d5ec49f1b2c817a8e8f1a1",
    "title": "Complete Project Documentation",
    "description": "Write and review all architectural documents",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-08-30T00:00:00.000Z",
    "createdAt": "2026-08-20T06:00:00.000Z",
    "updatedAt": "2026-08-20T06:00:00.000Z"
  }
}
```

#### Error Responses
- **404 Not Found** (Task not found or does not belong to user):
  ```json
  {
    "message": "Task not found"
  }
  ```
- **400 Bad Request** (Invalid task ID format):
  ```json
  {
    "message": "Invalid task ID format"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 4. Update Task
- **Method**: `PUT`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Requires Bearer Token)

#### Request Body
```json
{
  "title": "Updated Documentation Task",
  "description": "Updated task details",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2026-09-01T00:00:00.000Z"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "60d5ec49f1b2c817a8e8f1a2",
    "user": "60d5ec49f1b2c817a8e8f1a1",
    "title": "Updated Documentation Task",
    "description": "Updated task details",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2026-09-01T00:00:00.000Z",
    "createdAt": "2026-08-20T06:00:00.000Z",
    "updatedAt": "2026-08-20T09:45:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Invalid task ID format or invalid field values):
  ```json
  {
    "message": "Invalid status value"
  }
  ```
- **404 Not Found** (Task not found or does not belong to user):
  ```json
  {
    "message": "Task not found"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 5. Update Task Status
- **Method**: `PATCH`
- **Path**: `/api/tasks/:id/status`
- **Access**: Private (Requires Bearer Token)

#### Request Body
```json
{
  "status": "completed"
}
```

#### Success Response (200 OK)
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "60d5ec49f1b2c817a8e8f1a2",
    "user": "60d5ec49f1b2c817a8e8f1a1",
    "title": "Complete Project Documentation",
    "status": "completed",
    "priority": "high",
    "updatedAt": "2026-08-20T12:10:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Invalid status value or missing status):
  ```json
  {
    "message": "Invalid status value"
  }
  ```
- **404 Not Found** (Task not found or does not belong to user):
  ```json
  {
    "message": "Task not found"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 6. Delete Task
- **Method**: `DELETE`
- **Path**: `/api/tasks/:id`
- **Access**: Private (Requires Bearer Token)

#### Success Response (200 OK)
```json
{
  "message": "Task deleted successfully"
}
```

#### Error Responses
- **404 Not Found** (Task not found or does not belong to user):
  ```json
  {
    "message": "Task not found"
  }
  ```
- **400 Bad Request** (Invalid task ID format):
  ```json
  {
    "message": "Invalid task ID format"
  }
  ```
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```

---

### 7. Task Analytics
- **Method**: `GET`
- **Path**: `/api/tasks/analytics`
- **Access**: Private (Requires Bearer Token)

#### Success Response (200 OK)
```json
{
  "analytics": {
    "totalTasks": 10,
    "completedTasks": 4,
    "pendingTasks": 4,
    "inProgressTasks": 2,
    "statusBreakdown": {
      "pending": 4,
      "in-progress": 2,
      "completed": 4
    },
    "priorityBreakdown": {
      "low": 2,
      "medium": 5,
      "high": 3
    }
  }
}
```

#### Error Responses
- **401 Unauthorized** (Unauthenticated request):
  ```json
  {
    "message": "Not authorized, no token provided"
  }
  ```
