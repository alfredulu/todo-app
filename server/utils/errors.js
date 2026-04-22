export class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const ErrorCodes = {
  NOT_FOUND: { code: 'NOT_FOUND', statusCode: 404 },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', statusCode: 400 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', statusCode: 500 },
  BAD_REQUEST: { code: 'BAD_REQUEST', statusCode: 400 },
};

export function createErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  };
}
