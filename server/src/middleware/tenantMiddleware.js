const { mockData } = require('../services/mockDataStore');

const tenantScope = async (req, res, next) => {
  try {
    let tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
    if (!tenantId) {
      tenantId = mockData.tenants[0]._id;
    }
    req.tenantId = tenantId;
    next();
  } catch (error) {
    req.tenantId = 't_personal';
    next();
  }
};

module.exports = { tenantScope };
