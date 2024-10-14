const { validationResult } = require('express-validator'); // Import validationResult
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res) => {
    // Validate the incoming request using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({
            message: 'User created successfully.',
            user_id: newUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user.', error });
    }
};

// User Login
exports.login = async (req, res) => {
    // Validate the incoming request using express-validator (optional)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT Token (You may want to move 'your_jwt_secret' to .env for security)
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Send the token in the response
        res.status(200).json({ message: 'Login successful.', jwt_token: jwtToken });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error });
    }
};
