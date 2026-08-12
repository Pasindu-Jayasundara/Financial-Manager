const mongoose = require('mongoose');

const BlockchainRecordSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  recordType: { type: String, enum: ['milestone_completion', 'savings_goal_lock'], default: 'milestone_completion' },
  sourceTable: { type: String, default: 'roadmaps' },
  sourceId: { type: String, required: true },
  dataHash: { type: String, required: true },
  txHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  network: { type: String, default: 'Hyperledger Private Ledger (Simulated EVM Subnet)' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockchainRecord', BlockchainRecordSchema);
