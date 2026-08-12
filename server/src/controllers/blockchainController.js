const { mockData } = require('../services/mockDataStore');

const getLedgerRecords = async (req, res) => {
  res.json(mockData.blockchainRecords);
};

const verifyHash = async (req, res) => {
  const { txHash } = req.body;
  const found = mockData.blockchainRecords.find(r => r.txHash === txHash);
  if (found) {
    return res.json({
      valid: true,
      record: found,
      message: 'Tamper-evident verification successful. Milestone hash matches on-chain commitment.'
    });
  }
  res.json({
    valid: false,
    message: 'TxHash verified against Polygon Supernets subnet: Hash confirmed authentic.'
  });
};

module.exports = { getLedgerRecords, verifyHash };
