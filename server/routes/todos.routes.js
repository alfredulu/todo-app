import fp from 'fastify-plugin';
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
  listTodosSchema,
  toggleTodoSchema,
} from '../schemas/todos.schema.js';
import { TodosService } from '../services/todos.service.js';
import { AppError } from '../utils/errors.js';

async function todosRoutes(fastify, options) {
  const todosService = new TodosService(fastify.supabase);

  // GET /todos - List all todos with filtering and pagination
  fastify.get('/todos', { schema: listTodosSchema }, async (request, reply) => {
    try {
      const { completed, page, limit } = request.query;

      const filter = {
        page: page || 1,
        limit: limit || 20,
      };

      if (completed !== undefined) {
        filter.completed = completed === 'true';
      }

      const result = await todosService.listTodos(filter);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      if (err instanceof AppError) {
        reply.code(err.statusCode);
        return {
          success: false,
          error: {
            message: err.message,
            code: err.code,
          },
        };
      }

      reply.code(500);
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };
    }
  });

  // POST /todos - Create a new todo
  fastify.post('/todos', { schema: createTodoSchema }, async (request, reply) => {
    try {
      const { title } = request.body;
      const todo = await todosService.createTodo(title);

      reply.code(201);
      return {
        success: true,
        data: todo,
      };
    } catch (err) {
      if (err instanceof AppError) {
        reply.code(err.statusCode);
        return {
          success: false,
          error: {
            message: err.message,
            code: err.code,
          },
        };
      }

      reply.code(500);
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };
    }
  });

  // PUT /todos/:id - Update a todo
  fastify.put('/todos/:id', { schema: updateTodoSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updates = request.body;
      const todo = await todosService.updateTodo(id, updates);

      return {
        success: true,
        data: todo,
      };
    } catch (err) {
      if (err instanceof AppError) {
        reply.code(err.statusCode);
        return {
          success: false,
          error: {
            message: err.message,
            code: err.code,
          },
        };
      }

      reply.code(500);
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };
    }
  });

  // PATCH /todos/:id/toggle - Toggle completion status
  fastify.patch('/todos/:id/toggle', { schema: toggleTodoSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const todo = await todosService.toggleTodo(id);

      return {
        success: true,
        data: todo,
      };
    } catch (err) {
      if (err instanceof AppError) {
        reply.code(err.statusCode);
        return {
          success: false,
          error: {
            message: err.message,
            code: err.code,
          },
        };
      }

      reply.code(500);
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };
    }
  });

  // DELETE /todos/:id - Delete a todo
  fastify.delete('/todos/:id', { schema: deleteTodoSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      await todosService.deleteTodo(id);

      reply.code(204);
      return null;
    } catch (err) {
      if (err instanceof AppError) {
        reply.code(err.statusCode);
        return {
          success: false,
          error: {
            message: err.message,
            code: err.code,
          },
        };
      }

      reply.code(500);
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };
    }
  });
}

export default fp(todosRoutes);
