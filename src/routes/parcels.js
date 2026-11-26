const express = require('express');
const router = express.Router();

const parcelController = require('../controllers/parcelController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('ADMIN'));

// Keep specific routes before /:id.
router.get('/', parcelController.listParcels);
router.get('/new', parcelController.showRegisterForm);
router.post('/quote', parcelController.getQuote);
router.post('/', parcelController.createParcel);

router.get('/:id', parcelController.showParcelDetails);
router.post('/:id/assign', parcelController.assignStaff);
router.post('/:id/status', parcelController.updateStatus);
router.post('/:id/return', parcelController.initiateReturn);

module.exports = router;