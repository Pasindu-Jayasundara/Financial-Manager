const mongoose = require('mongoose');

const BudgetAllocationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  totalIncome: { type: Number, default: 0 },
  savingsPct: { type: Number, default: 20 },
  loansPct: { type: Number, default: 15 },
  familyPct: { type: Number, default: 20 },
  dailyExpensesPct: { type: Number, default: 35 },
  hobbiesPct: { type: Number, default: 10 },
  isCustomized: { type: Boolean, default: false },
  policyApplied: {
    ageBand: String,
    healthRiskTier: String,
    healthBufferPct: Number,
    notes: String
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BudgetAllocation', BudgetAllocationSchema);
