const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number, default: 32 },
  ageBand: { type: String, default: '30-49' },
  medicalConditions: [{ type: String }],
  defaultTenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
