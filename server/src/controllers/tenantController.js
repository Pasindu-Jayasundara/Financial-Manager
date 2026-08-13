const Tenant = require('../models/Tenant');
const User = require('../models/User');
const getTenants = async (req, res) => {
  try { res.json(await Tenant.find({ members: req.user._id }).sort({ createdAt: 1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
const createTenant = async (req, res) => {
  try {
    const { name, type = 'personal' } = req.body;
    if (!name) return res.status(400).json({ message: 'Workspace name is required.' });
    const tenant = await Tenant.create({ name, type, owner: req.user._id, members: [req.user._id] });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { tenants: tenant._id } });
    res.status(201).json(tenant);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getTenants, createTenant };
