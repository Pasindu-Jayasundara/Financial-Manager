const express = require('express');
const router = express.Router();
const { 
  getFinancialSummary, 
  addIncome, 
  deleteIncome, 
  addExpense, 
  updateExpense,
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
router.put('/expense/:id', updateExpense);
router.delete('/expense/:id', deleteExpense);
router.put('/budget', updateBudgetAllocation);

module.exports = router;
