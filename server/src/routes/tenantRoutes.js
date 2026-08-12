const express = require('express');
const router = express.Router();
const { getTenants, createTenant } = require('../controllers/tenantController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTenants);
router.post('/', protect, createTenant);

module.exports = router;
