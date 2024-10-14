const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization');

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token and remove the 'Bearer ' prefix if present
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret');

        // Add the verified user data to the request object
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid, return a 400 Bad Request response
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
