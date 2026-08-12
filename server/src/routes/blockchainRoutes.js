const express = require('express');
const router = express.Router();
const { getLedgerRecords, verifyHash } = require('../controllers/blockchainController');
const { protect } = require('../middleware/auth');
const { tenantScope } = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantScope);

router.get('/ledger', getLedgerRecords);
router.post('/verify', verifyHash);

module.exports = router;
