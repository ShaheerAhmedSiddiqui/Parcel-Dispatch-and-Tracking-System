const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const {
    redirectIfAuthenticated,
    requireAuth
} = require('../middleware/auth');

// Display login page
router.get(
    '/login',
    redirectIfAuthenticated,
    authController.showLogin
);

// Process login form
router.post('/login', authController.login);

// Logout
router.post('/logout', requireAuth, authController.logout);

module.exports = router;