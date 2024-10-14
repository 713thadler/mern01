const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { check, validationResult } = require('express-validator');

// POST /signup with validation
router.post('/signup', [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.signup);

// POST /login
router.post('/login', [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').notEmpty()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.login);

module.exports = router;
