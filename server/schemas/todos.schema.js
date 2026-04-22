export const createTodoSchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 500,
        description: 'The task title',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            completed: { type: 'boolean' },
            created_at: { type: 'string' },
          },
        },
      },
    },
  },
};

export const updateTodoSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 500,
      },
      completed: {
        type: 'boolean',
      },
    },
  },
};

export const deleteTodoSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
};

export const listTodosSchema = {
  querystring: {
    type: 'object',
    properties: {
      completed: {
        type: 'boolean',
        description: 'Filter by completion status',
      },
      page: {
        type: 'integer',
        minimum: 1,
        default: 1,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 20,
      },
    },
  },
};

export const toggleTodoSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
};
