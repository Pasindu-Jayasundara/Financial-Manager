const express = require('express');
const router = express.Router();
const { 
  getFinancialSummary, 
  addIncome, 
  deleteIncome, 
  addExpense, 
  deleteExpense, 
  updateBudgetAllocation 
} = require('../controllers/financeController');
const { protect } = require('../middleware/auth');
const { tenantScope } = require('../middleware/tenantMiddleware');

router.use(protect);
router.use(tenantScope);

router.get('/summary', getFinancialSummary);
router.post('/income', addIncome);
router.delete('/income/:id', deleteIncome);
router.post('/expense', addExpense);
router.delete('/expense/:id', deleteExpense);
router.put('/budget', updateBudgetAllocation);

module.exports = router;
