const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { getIsConnected } = require('../config/db');
const { calculatePolicyAllocation } = require('../services/suggestionPolicy');
const { JWT_SECRET } = require('../middleware/auth');

const ageBandFor = (age) => age >= 65 ? '65+' : age >= 50 ? '50-64' : age >= 30 ? '30-49' : '18-29';
const createToken = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    if (!getIsConnected()) return res.status(503).json({ message: 'Database connection is unavailable. Please try again after MongoDB reconnects.' });
    const { name, email, password, age, medicalConditions = [] } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const numericAge = age ? Number(age) : 30;
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), age: numericAge, ageBand: ageBandFor(numericAge), medicalConditions });
    const tenant = await Tenant.create({ name: `${name}'s Workspace`, type: 'personal', owner: user._id, members: [user._id] });
    user.defaultTenant = tenant._id;
    user.tenants = [tenant._id];
    await user.save();
    res.status(201).json({ token: createToken(user), user: user.toObject(), tenant });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const login = async (req, res) => {
  try {
    if (!getIsConnected()) return res.status(503).json({ message: 'Database connection is unavailable. Please try again after MongoDB reconnects.' });
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: createToken(user), user: user.toObject() });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProfile = async (req, res) => {
  const policy = calculatePolicyAllocation(req.user, 0);
  res.json({
    user: req.user,
    policyApplied: policy.policyApplied
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, age, medicalConditions } = req.body;
    if (name) req.user.name = name;
    if (age !== undefined) { req.user.age = Number(age); req.user.ageBand = ageBandFor(req.user.age); }
    if (medicalConditions !== undefined) req.user.medicalConditions = medicalConditions;
    await req.user.save();
    res.json(req.user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { register, login, getProfile, updateProfile };
