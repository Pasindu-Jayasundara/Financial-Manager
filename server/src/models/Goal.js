const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetIncome: { type: Number, required: true },
  currentIncome: { type: Number, default: 0 },
  targetMonths: { type: Number, default: 12 },
  declaredSkills: [{ type: String }],
  matchedJobs: [{
    role: String,
    industry: String,
    category: String,
    location: String,
    estimatedSalary: Number,
    requiredSkills: [String],
    gapSkills: [String],
    matchPercentage: Number,
    applicationUrl: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
