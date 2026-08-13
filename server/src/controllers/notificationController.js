const Notification = require('../models/Notification');
const getNotifications = async (req, res) => {
  try { res.json(await Notification.find({ tenantId: req.tenantId, $or: [{ userId: req.user._id }, { userId: null }] }).sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getNotifications };
