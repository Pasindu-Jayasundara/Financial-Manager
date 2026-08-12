const jwt = require('jsonwebtoken');
const { calculatePolicyAllocation } = require('../services/suggestionPolicy');
const { mockData } = require('../services/mockDataStore');
const { JWT_SECRET } = require('../middleware/auth');

const seedDemoDataIfEmpty = async () => {};

const register = async (req, res) => {
  const { name, email, age, medicalConditions } = req.body;
  mockData.user.name = name;
  mockData.user.email = email;
  if (age) mockData.user.age = Number(age);
  if (medicalConditions) mockData.user.medicalConditions = medicalConditions;
  res.status(201).json(mockData.user);
};

const login = async (req, res) => {
  res.json(mockData.user);
};

const getProfile = async (req, res) => {
  const policy = calculatePolicyAllocation(mockData.user, 6000);
  res.json({
    user: mockData.user,
    policyApplied: policy.policyApplied
  });
};

const updateProfile = async (req, res) => {
  const { name, age, medicalConditions } = req.body;
  if (name) mockData.user.name = name;
  if (age) mockData.user.age = Number(age);
  if (medicalConditions) mockData.user.medicalConditions = medicalConditions;

  if (mockData.user.age >= 65) mockData.user.ageBand = '65+';
  else if (mockData.user.age >= 50) mockData.user.ageBand = '50-64';
  else if (mockData.user.age >= 30) mockData.user.ageBand = '30-49';
  else mockData.user.ageBand = '18-29';

  res.json(mockData.user);
};

module.exports = { register, login, getProfile, updateProfile, seedDemoDataIfEmpty };
