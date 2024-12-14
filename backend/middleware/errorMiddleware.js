// middleware/errorMiddleware.js

// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging (optional)

  // Check if the error is a validation error or any other custom error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // If the error has a response property (custom errors), send that response
  if (err.response) {
    return res.status(err.statusCode || 400).json({ message: err.response });
  }

  // General error handler for uncaught errors
  res.status(500).json({ message: 'Internal Server Error', details: err.message });
};