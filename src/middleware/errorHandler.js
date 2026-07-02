import { ZodError } from 'zod';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
};

export const errorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Duplicated resource.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error.' });
};
