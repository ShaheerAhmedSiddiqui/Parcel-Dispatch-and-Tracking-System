
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/dashboard', adminController.showDashboard);

module.exports = router;
