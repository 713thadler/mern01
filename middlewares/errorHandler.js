module.exports = (err, req, res, next) => {
    // Log the error stack trace (useful for debugging)
    console.error(err.stack);

    // Handle specific error types (customize as needed)
    if (err.name === 'ValidationError') {
        // For Mongoose validation errors, return a 400 status code
        return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }

    if (err.name === 'JsonWebTokenError') {
        // Handle JWT-related errors (invalid signature, etc.)
        return res.status(401).json({ message: 'Invalid token.' });
    }

    if (err.name === 'TokenExpiredError') {
        // Handle JWT expiration errors
        return res.status(401).json({ message: 'Token expired.' });
    }

    // Handle validation errors from `express-validator`
    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }

    // For all other unhandled errors, return a generic 500 status code
    return res.status(500).json({ message: 'Something went wrong!', error: err.message });
};
