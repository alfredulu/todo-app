## Project Structure

```
todo-app/
├── README.md                          # Full documentation
├── setup.sh                           # Setup script for installation
├── .gitignore                         # Git ignore file
│
├── server/                            # Fastify Backend
│   ├── app.js                         # Server entry point
│   ├── package.json                   # Server dependencies
│   ├── .env.example                   # Environment template
│   ├── plugins/
│   │   └── supabase.js               # Supabase client plugin
│   ├── routes/
│   │   └── todos.routes.js           # Route handlers (6 endpoints)
│   ├── services/
│   │   └── todos.service.js          # Business logic & DB queries
│   ├── schemas/
│   │   └── todos.schema.js           # JSON Schema validation
│   └── utils/
│       └── errors.js                 # Error handling utilities
│
└── client/                            # React Frontend
    ├── index.html                     # HTML entry point
    ├── package.json                   # Client dependencies
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── postcss.config.js              # PostCSS config
    └── src/
        ├── main.jsx                   # React app initialization
        ├── App.jsx                    # Main app component
        ├── api.js                     # API client utilities
        ├── index.css                  # Global Tailwind styles
        └── components/
            ├── TodoItem.jsx           # Todo item component
            └── Toast.jsx              # Notification component
```

## What's Included

### Backend (Fastify + Supabase)
- ✅ Complete CRUD API for todos
- ✅ Layered architecture (routes → services → database)
- ✅ JSON Schema validation for all endpoints
- ✅ Centralized error handling with proper HTTP status codes
- ✅ Supabase plugin for dependency injection
- ✅ Pagination support (page & limit)
- ✅ Filtering by completion status
- ✅ Environment configuration (.env)
- ✅ Built-in logging via Fastify logger
- ✅ CORS enabled for frontend

### Frontend (React + Vite + Tailwind)
- ✅ Beautiful, responsive UI
- ✅ Add/read/update/delete/toggle todos
- ✅ Filter tabs: All / Active / Completed
- ✅ Inline task editing
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty state handling
- ✅ Clean React hooks (useState, useEffect)
- ✅ API client with error handling

### Database (Supabase PostgreSQL)
- ✅ Simple todos table schema
- ✅ UUID primary key with auto-generation
- ✅ Timestamps for created_at
- ✅ Completion status tracking
- ✅ Indexes for common queries

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | List todos (supports filtering & pagination) |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo title/completed |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |
| DELETE | `/api/todos/:id` | Delete todo |

All responses follow consistent format: `{ success: true/false, data/error: ... }`

## Key Design Decisions

1. **Backend Focus**: Strong emphasis on clean API design, validation, and error handling
2. **Layered Architecture**: Clear separation between routes, services, and database
3. **No Over-engineering**: Only features that add real value for a todo app
4. **Production Ready**: Proper error codes, logging, validation
5. **Frontend Polish**: Beautiful UI without excessive animations
6. **Zero Auth**: Single-user local app (no authentication needed)

## File Sizes (Approximate)

- Backend: ~2KB (core files, excluding node_modules)
- Frontend: ~4KB (core JSX files, excluding node_modules)
- Database: Single table with simple schema

## Tech Stack Summary

**Backend**: Fastify 4.24, Supabase JS SDK, Node.js 18+
**Frontend**: React 18, Vite 5, Tailwind CSS 3
**Database**: PostgreSQL (via Supabase)
**Development**: npm, ES modules
