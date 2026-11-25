const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('DELIVERY_STAFF'));

router.get('/', staffController.showDashboard);
router.get('/parcels/:id', staffController.showDeliveryDetails);
router.post('/parcels/:id/status', staffController.updateDeliveryStatus);

module.exports = router;