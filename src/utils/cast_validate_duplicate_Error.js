const errorHandler = (err, req, res, next) => {
    // Handle Mongoose CastError
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    // Handle Mongoose ValidationError
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: err.errors,
      });
    }
  
    // Handle Duplicate Key Error (e.g., unique field conflict)
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate key error',
        field: Object.keys(err.keyValue),
      });
    }
  
    // Log all other errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };
  
 export default errorHandler;
  