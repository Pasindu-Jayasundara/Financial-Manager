const express = require('express');
const router = express.Router();
const { getGoalAndRoadmap, updateGoalSkills, toggleTaskCompletion } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const { tenantScope } = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantScope);

router.get('/roadmap', getGoalAndRoadmap);
router.put('/goal', updateGoalSkills);
router.put('/roadmap/:roadmapId/task/:taskId', toggleTaskCompletion);

module.exports = router;
