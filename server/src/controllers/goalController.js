const Goal = require('../models/Goal');
const Roadmap = require('../models/Roadmap');
const Income = require('../models/Income');
const { commitMilestoneToBlockchain } = require('../services/blockchainService');
const { buildRoadmap, generateJobMatches } = require('../services/roadmapGenerator');

const getGoalAndRoadmap = async (req, res) => {
  try {
    let goal = await Goal.findOne({ tenantId: req.tenantId, userId: req.user._id });
    
    // Auto-initialize Goal if none exists
    if (!goal) {
      const incomes = await Income.find({ tenantId: req.tenantId, userId: req.user._id });
      const currentIncome = incomes.reduce((sum, item) => {
        if (item.frequency === 'weekly') return sum + (item.amount * 52) / 12;
        if (item.frequency === 'annually') return sum + item.amount / 12;
        return sum + item.amount;
      }, 0);

      const targetIncome = currentIncome > 0 ? Math.round(currentIncome * 1.25) : 100000;
      const initialSkills = ['JavaScript', 'Python'];
      const matchedJobs = generateJobMatches(initialSkills, targetIncome);

      goal = await Goal.create({
        tenantId: req.tenantId,
        userId: req.user._id,
        title: 'Monthly Income Goal',
        targetIncome,
        currentIncome,
        targetMonths: 12,
        declaredSkills: initialSkills,
        matchedJobs
      });
    }

    let roadmaps = await Roadmap.find({ tenantId: req.tenantId }).sort({ month: 1 });

    // Auto-generate roadmaps if missing or empty
    if (!roadmaps || roadmaps.length === 0) {
      const roadmapItems = buildRoadmap(goal);
      roadmaps = await Roadmap.insertMany(roadmapItems);
    }

    res.json({ goal, roadmaps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGoalSkills = async (req, res) => {
  try {
    const { title, targetIncome, currentIncome, targetMonths, declaredSkills } = req.body;
    const update = { userId: req.user._id };
    if (title !== undefined) update.title = title;
    if (targetIncome !== undefined) update.targetIncome = Number(targetIncome);
    if (currentIncome !== undefined) update.currentIncome = Number(currentIncome);
    if (targetMonths !== undefined) update.targetMonths = Number(targetMonths);
    if (declaredSkills !== undefined) update.declaredSkills = declaredSkills;

    let existingGoal = await Goal.findOne({ tenantId: req.tenantId, userId: req.user._id });
    if (!existingGoal && (!Number.isFinite(update.targetIncome) || update.targetIncome <= 0)) {
      return res.status(400).json({ message: 'A positive target income is required to create a goal.' });
    }
    if (!existingGoal && !update.title) update.title = 'Monthly Income Goal';

    const skillsToUse = update.declaredSkills !== undefined ? update.declaredSkills : (existingGoal?.declaredSkills || []);
    const targetIncToUse = update.targetIncome !== undefined ? update.targetIncome : (existingGoal?.targetIncome || 100000);
    update.matchedJobs = generateJobMatches(skillsToUse, targetIncToUse);

    const goal = await Goal.findOneAndUpdate(
      { tenantId: req.tenantId, userId: req.user._id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Regenerate roadmap tasks to reflect updated target income and declared skills
    await Roadmap.deleteMany({ tenantId: req.tenantId });
    const roadmaps = await Roadmap.insertMany(buildRoadmap(goal));

    res.json({ goal, roadmaps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.roadmapId, tenantId: req.tenantId });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap item not found.' });
    const task = roadmap.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : undefined;
    roadmap.isCompleted = roadmap.tasks.length > 0 && roadmap.tasks.every(item => item.completed);
    if (roadmap.isCompleted && !roadmap.blockchainVerified) {
      const record = await commitMilestoneToBlockchain(req.tenantId, roadmap._id, roadmap.toObject());
      roadmap.blockchainVerified = true;
      roadmap.blockchainTxHash = record.txHash;
    }
    await roadmap.save();
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoalAndRoadmap, updateGoalSkills, toggleTaskCompletion };
