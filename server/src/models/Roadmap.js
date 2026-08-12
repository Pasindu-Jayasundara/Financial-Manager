const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ['Skill Acquisition', 'Job Application', 'Savings Target', 'Health Buffer'], default: 'Skill Acquisition' },
  completed: { type: Boolean, default: false },
  completedAt: Date
});

const RoadmapSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  month: { type: Number, required: true },
  milestoneTitle: { type: String, required: true },
  targetIncomeIncrease: { type: Number, default: 0 },
  tasks: [TaskSchema],
  isCompleted: { type: Boolean, default: false },
  blockchainVerified: { type: Boolean, default: false },
  blockchainTxHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
