const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');

const tenantScope = async (req, res, next) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || req.user.defaultTenant;
    if (!tenantId || !mongoose.isValidObjectId(tenantId)) {
      return res.status(400).json({ message: 'A valid workspace is required.' });
    }
    const tenant = await Tenant.findOne({ _id: tenantId, members: req.user._id });
    if (!tenant) return res.status(403).json({ message: 'You do not have access to this workspace.' });
    req.tenantId = tenantId;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { tenantScope };
