const { mockData } = require('../services/mockDataStore');

const getNotifications = async (req, res) => {
  res.json(mockData.notifications);
};

module.exports = { getNotifications };
