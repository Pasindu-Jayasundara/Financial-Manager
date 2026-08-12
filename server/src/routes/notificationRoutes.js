const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { tenantScope } = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantScope);

router.get('/', getNotifications);

module.exports = router;
