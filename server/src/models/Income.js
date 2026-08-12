const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['monthly', 'weekly', 'annually'], default: 'monthly' },
  isFixed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', IncomeSchema);
