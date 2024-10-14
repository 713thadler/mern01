const { validationResult } = require('express-validator'); // Import validationResult
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully.',
            user_id: newUser._id,
        });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error for debugging
        res.status(500).json({
            message: 'An error occurred while creating the user.',
            error: error.message || 'Internal server error.',
        });
    }
};

// User Loginin
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Provided password:', password); // Debugging log
        console.log('Stored hashed password:', user.password); // Debugging log
        console.log('Password match result:', isPasswordCorrect); // Debugging log

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            jwt_token: token,
        });
    } catch (error) {
        console.error('Error during login:', error);  // Log any error
        res.status(500).json({
            message: 'An error occurred while logging in.',
            error: error.message || 'Internal server error.',
        });
    }
};