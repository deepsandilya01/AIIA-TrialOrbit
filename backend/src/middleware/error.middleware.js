const env = require('../config/env');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    message = 'Validation Error';
    statusCode = 400;
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.nodeEnv === 'production' ? null : err.stack,
  });
};

module.exports = { notFoundHandler, errorHandler };
