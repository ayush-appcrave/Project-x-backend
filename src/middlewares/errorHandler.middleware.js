import { ApiError } from '../utils/ApiError.js';

function errorHandler(err, req, res, next) {
  console.log("Error Details:", {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
    });
  }
  // Handle other errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal Server Error',
    errors: err?.message ? [err.message] : [],
  });
}

export { errorHandler };
