# Todo App - Production Grade CRUD Application

A full-stack todo application with a strong backend focus. Built with **Fastify**, **Supabase (PostgreSQL)**, and **React + Vite + Tailwind CSS**.

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### Setup

#### 1. Supabase Database

1. Create a Supabase project at https://supabase.com
2. Run this SQL in the SQL editor to create the todos table:

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

3. Get your credentials:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key

#### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
PORT=3000
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`

The frontend proxies API requests to `http://localhost:3000/api`

---

## API Documentation

**Base URL:** `/api/todos`

All responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Endpoints

#### GET /todos

List all todos with optional filtering and pagination.

**Query Parameters:**

- `completed` (boolean, optional): Filter by completion status
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 20): Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "uuid",
        "title": "Task title",
        "completed": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

**Examples:**

```bash
# Get all todos
curl http://localhost:3000/api/todos

# Get only completed todos
curl http://localhost:3000/api/todos?completed=true

# Pagination
curl http://localhost:3000/api/todos?page=2&limit=10
```

---

#### POST /todos

Create a new todo.

**Request Body:**

```json
{
  "title": "Task title"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Task title",
    "completed": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Status:** 201 Created

---

#### PUT /todos/:id

Update a todo's title and/or completion status.

**Request Body:**

```json
{
  "title": "Updated title",
  "completed": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated title",
    "completed": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH /todos/:id/toggle

Toggle the completion status of a todo.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Task title",
    "completed": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### DELETE /todos/:id

Delete a todo.

**Response:** 204 No Content (on success)

---

## Architecture

### Backend Structure

```
server/
├── app.js                 # Fastify app initialization
├── plugins/
│   └── supabase.js       # Supabase client injection
├── routes/
│   └── todos.routes.js   # Route handlers
├── services/
│   └── todos.service.js  # Business logic & DB queries
├── schemas/
│   └── todos.schema.js   # JSON Schema validation
└── utils/
    └── errors.js         # Error handling utilities
```

**Key Design Patterns:**

- **Plugin Architecture:** Supabase client registered as Fastify plugin
- **Layered Structure:** Routes → Services → Database
- **Input Validation:** Fastify JSON Schema validation
- **Error Handling:** Centralized `AppError` class with proper HTTP status codes
- **Async/Await:** Clean asynchronous error handling throughout

### Frontend Structure

```
client/
├── src/
│   ├── App.jsx           # Main app component
│   ├── api.js            # API client utilities
│   ├── index.css         # Tailwind + global styles
│   ├── main.jsx          # React entry point
│   └── components/
│       ├── Toast.jsx     # Notification component
│       └── TodoItem.jsx  # Todo item component
└── vite.config.js        # Vite configuration with API proxy
```

**UI Features:**

- Responsive design with Tailwind CSS
- Filter tabs: All / Active / Completed
- Inline task editing
- Toast notifications for feedback
- Empty state handling
- Loading state indicators

---

## Features

### Core CRUD

✅ Create tasks  
✅ Read tasks (list with filtering & pagination)  
✅ Update task title and completion  
✅ Delete tasks  
✅ Toggle completion

### Production Touches

✅ Pagination with page/limit support  
✅ Filtering by completion status  
✅ Input validation with clear error messages  
✅ Proper HTTP status codes (201, 204, 404, 400, 500)  
✅ Centralized error handling  
✅ Logging via Fastify logger  
✅ Environment configuration  
✅ CORS enabled

### UI/UX

✅ Beautiful, responsive design  
✅ Filter tabs with counts  
✅ Inline task editing  
✅ Smooth transitions and hover states  
✅ Toast notifications  
✅ Empty state messaging  
✅ Loading states

---

## Error Handling

The API returns meaningful error messages:

```json
{
  "success": false,
  "error": {
    "message": "Title is required",
    "code": "VALIDATION_ERROR"
  }
}
```

**Common Errors:**

- `404 NOT_FOUND` - Task not found
- `400 VALIDATION_ERROR` - Invalid input
- `400 BAD_REQUEST` - Missing required fields
- `500 INTERNAL_ERROR` - Server error

---

## Development

### Running Tests

```bash
# Start both servers in separate terminals
cd server && npm run dev
cd client && npm run dev
```

Then visit `http://localhost:5173`

### Building for Production

**Backend:**

```bash
# No build step needed for Node.js
npm run start
```

**Frontend:**

```bash
npm run build
# Outputs to dist/
```

---

## 🌐 Production Deployment

### Quick Summary

The frontend will use the `VITE_API_URL` environment variable in production, while locally it uses the `/api` proxy.

---

## Tech Stack

**Backend:**

- Fastify 4.24+ (fast HTTP framework)
- @supabase/supabase-js (PostgreSQL client)
- JSON Schema validation (built-in to Fastify)

**Frontend:**

- React 18
- Vite 5 (blazing fast bundler)
- Tailwind CSS 3
- PostCSS & Autoprefixer

**Database:**

- Supabase (managed PostgreSQL)

---

## Notes

- No authentication included (single-user local app)
- No database migrations tool (manual SQL setup)
- Supabase free tier is sufficient for development
- API uses standard REST conventions
- Frontend includes error recovery and loading states
- Environment variables for local and production
