// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');  // For serving static files
const bodyParser = require('body-parser');
const userController = require('./controllers/user.controller');

// Load environment variables from the .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware for body parsing (in case needed for other forms or raw data)
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Async function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully...');
    } catch (err) {
        console.error('MongoDB connection error: ', err);
        process.exit(1);  // Exit process if MongoDB connection fails
    }
};

// Connect to MongoDB
connectDB();

// Routes

// Route to serve the index page (root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the registration form
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Route to serve the login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// API Routes for user signup and login (assumed from the userController)
// Using '/api/v1/user/signup' for signup route as per the original code
app.post('/api/v1/user/signup', userController.signup);

// API route for login (assuming you want a login route too, similar to signup)
app.post('/api/v1/user/login', userController.login);

// Catch-all route to serve a 404 page if the route is not found
app.get('*', (req, res) => {
    res.status(404).send('Page not found.');
});

// Start the server and listen on the specified PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
