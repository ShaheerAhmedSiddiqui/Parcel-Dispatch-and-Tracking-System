const express = require('express');
const router = express.Router();

const trackingController = require('../controllers/trackingController');

// Public tracking page and search.
router.get('/', trackingController.showTracking);

module.exports = router;