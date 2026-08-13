const Income = require('../models/Income');
const Expense = require('../models/Expense');
const BudgetAllocation = require('../models/BudgetAllocation');
const { calculatePolicyAllocation } = require('../services/suggestionPolicy');

const getFinancialSummary = async (req, res) => {
  try {
    const [incomes, expenses, budget] = await Promise.all([
      Income.find({ tenantId: req.tenantId, userId: req.user._id }).sort({ createdAt: -1 }),
      Expense.find({ tenantId: req.tenantId, userId: req.user._id }).sort({ createdAt: -1 }),
      BudgetAllocation.findOne({ tenantId: req.tenantId })
    ]);
    const monthlyIncome = (income) => {
      if (income.frequency === 'weekly') return (income.amount * 52) / 12;
      if (income.frequency === 'annually') return income.amount / 12;
      return income.amount;
    };
    const totalIncome = incomes.reduce((sum, item) => sum + monthlyIncome(item), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    res.json({ totalIncome: Math.round(totalIncome * 100) / 100, totalExpense: Math.round(totalExpense * 100) / 100, netCashflow: Math.round((totalIncome - totalExpense) * 100) / 100, incomes, expenses, budget: budget || calculatePolicyAllocation(req.user, totalIncome) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addIncome = async (req, res) => {
  try {
    const { source, amount, frequency = 'monthly', isFixed = true } = req.body;
    if (!source || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ message: 'A source and positive amount are required.' });
    const income = await Income.create({ tenantId: req.tenantId, userId: req.user._id, source, amount: Number(amount), frequency, isFixed });
    res.status(201).json(income);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId, userId: req.user._id });
    if (!income) return res.status(404).json({ message: 'Income record not found.' });
    res.json({ message: 'Income deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addExpense = async (req, res) => {
  try {
    const { title, amount, category = 'Food & Dining', isRecurring = true } = req.body;
    if (!title || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ message: 'A title and positive amount are required.' });
    const expense = await Expense.create({ tenantId: req.tenantId, userId: req.user._id, title, amount: Number(amount), category, isRecurring });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId, userId: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense record not found.' });
    res.json({ message: 'Expense deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateBudgetAllocation = async (req, res) => {
  try {
    const fields = ['savingsPct', 'loansPct', 'familyPct', 'dailyExpensesPct', 'hobbiesPct'];
    const budget = {};
    for (const field of fields) budget[field] = Number(req.body[field]);
    if (Object.values(budget).some(value => !Number.isFinite(value)) || Object.values(budget).reduce((sum, value) => sum + value, 0) !== 100) return res.status(400).json({ message: 'Budget percentages must total 100.' });
    budget.isCustomized = true;
    budget.updatedAt = new Date();
    budget.policyApplied = { notes: 'User customized budget allocation' };
    const saved = await BudgetAllocation.findOneAndUpdate({ tenantId: req.tenantId }, budget, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ budget: saved, warnings: [] });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getFinancialSummary, addIncome, deleteIncome, addExpense, deleteExpense, updateBudgetAllocation };
