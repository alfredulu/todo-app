import { AppError, ErrorCodes } from '../utils/errors.js';

export class TodosService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async listTodos(filter = {}) {
    const { completed, page = 1, limit = 20 } = filter;

    try {
      let query = this.supabase.from('todos').select('*', { count: 'exact' });

      if (completed !== undefined) {
        query = query.eq('completed', completed);
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new AppError('Failed to fetch todos', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
      }

      return {
        todos: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database error', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
    }
  }

  async createTodo(title) {
    if (!title || title.trim().length === 0) {
      throw new AppError('Title is required', ErrorCodes.VALIDATION_ERROR.code, ErrorCodes.VALIDATION_ERROR.statusCode);
    }

    try {
      const { data, error } = await this.supabase
        .from('todos')
        .insert([{ title: title.trim(), completed: false }])
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to create todo', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
      }

      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database error', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
    }
  }

  async updateTodo(id, updates) {
    if (!id) {
      throw new AppError('Todo ID is required', ErrorCodes.BAD_REQUEST.code, ErrorCodes.BAD_REQUEST.statusCode);
    }

    const updateData = {};
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new AppError('Title cannot be empty', ErrorCodes.VALIDATION_ERROR.code, ErrorCodes.VALIDATION_ERROR.statusCode);
      }
      updateData.title = updates.title.trim();
    }
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No fields to update', ErrorCodes.BAD_REQUEST.code, ErrorCodes.BAD_REQUEST.statusCode);
    }

    try {
      const { data, error } = await this.supabase
        .from('todos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new AppError('Task not found', ErrorCodes.NOT_FOUND.code, ErrorCodes.NOT_FOUND.statusCode);
      }

      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database error', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
    }
  }

  async deleteTodo(id) {
    if (!id) {
      throw new AppError('Todo ID is required', ErrorCodes.BAD_REQUEST.code, ErrorCodes.BAD_REQUEST.statusCode);
    }

    try {
      const { error, data } = await this.supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new AppError('Task not found', ErrorCodes.NOT_FOUND.code, ErrorCodes.NOT_FOUND.statusCode);
      }

      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database error', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
    }
  }

  async toggleTodo(id) {
    if (!id) {
      throw new AppError('Todo ID is required', ErrorCodes.BAD_REQUEST.code, ErrorCodes.BAD_REQUEST.statusCode);
    }

    try {
      // First fetch the current state
      const { data: currentData, error: fetchError } = await this.supabase
        .from('todos')
        .select('completed')
        .eq('id', id)
        .single();

      if (fetchError || !currentData) {
        throw new AppError('Task not found', ErrorCodes.NOT_FOUND.code, ErrorCodes.NOT_FOUND.statusCode);
      }

      // Then update with toggled value
      const { data, error } = await this.supabase
        .from('todos')
        .update({ completed: !currentData.completed })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to toggle todo', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
      }

      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database error', ErrorCodes.INTERNAL_ERROR.code, ErrorCodes.INTERNAL_ERROR.statusCode);
    }
  }
}
