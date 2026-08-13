const BlockchainRecord = require('../models/BlockchainRecord');
const { verifyBlockchainHash } = require('../services/blockchainService');

const getLedgerRecords = async (req, res) => {
  try { res.json(await BlockchainRecord.find({ tenantId: req.tenantId }).sort({ timestamp: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

const verifyHash = async (req, res) => {
  try {
    const result = await verifyBlockchainHash(req.body.txHash);
    if (result.record && String(result.record.tenantId) !== String(req.tenantId)) return res.status(404).json({ valid: false, message: 'Transaction hash not found on this workspace ledger.' });
    res.json(result);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getLedgerRecords, verifyHash };
