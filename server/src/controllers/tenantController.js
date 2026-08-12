const { mockData } = require('../services/mockDataStore');

const getTenants = async (req, res) => {
  res.json(mockData.tenants);
};

const createTenant = async (req, res) => {
  const { name, type } = req.body;
  const newTenant = {
    _id: 't_' + Date.now(),
    name,
    type: type || 'personal'
  };
  mockData.tenants.push(newTenant);
  res.status(201).json(newTenant);
};

module.exports = { getTenants, createTenant };
