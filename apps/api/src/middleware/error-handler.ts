import { ErrorHandler } from 'hono';

export const globalErrorHandler: ErrorHandler = (err, c) => {
  console.error('[API Error]:', err);

  return c.json(
    {
      success: false,
      error: err.message || 'Internal Server Error',
    },
    500
  );
};
