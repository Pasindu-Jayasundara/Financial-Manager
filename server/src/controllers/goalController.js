const Goal = require('../models/Goal');
const Roadmap = require('../models/Roadmap');
const { commitMilestoneToBlockchain } = require('../services/blockchainService');
const { mockData } = require('../services/mockDataStore');

const getGoalAndRoadmap = async (req, res) => {
  try {
    const goal = await Goal.findOne({ tenantId: req.tenantId });
    const roadmaps = await Roadmap.find({ tenantId: req.tenantId });
    if (goal && roadmaps) return res.json({ goal, roadmaps });
    res.json({ goal: mockData.goal, roadmaps: mockData.roadmaps });
  } catch (error) {
    res.json({ goal: mockData.goal, roadmaps: mockData.roadmaps });
  }
};

const updateGoalSkills = async (req, res) => {
  try {
    const { targetIncome, declaredSkills } = req.body;
    if (targetIncome) mockData.goal.targetIncome = Number(targetIncome);
    if (declaredSkills) mockData.goal.declaredSkills = declaredSkills;
    res.json(mockData.goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const { roadmapId, taskId } = req.params;
    let foundTask = null;
    let targetRm = null;

    mockData.roadmaps.forEach(rm => {
      if (rm._id === roadmapId) {
        targetRm = rm;
        rm.tasks.forEach(t => {
          if (t._id === taskId) {
            t.completed = !t.completed;
            foundTask = t;
          }
        });
        const allCompleted = rm.tasks.every(t => t.completed);
        rm.isCompleted = allCompleted;
        if (allCompleted && !rm.blockchainVerified) {
          rm.blockchainVerified = true;
          rm.blockchainTxHash = '0x' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
        }
      }
    });

    res.json({ roadmap: targetRm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoalAndRoadmap, updateGoalSkills, toggleTaskCompletion };
