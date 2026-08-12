const express = require('express');
const router = express.Router();
const { getAnalyticsAndForecast } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { tenantScope } = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantScope);

router.get('/forecast', getAnalyticsAndForecast);

module.exports = router;
