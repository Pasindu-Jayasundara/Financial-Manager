const Income = require('../models/Income');
const Expense = require('../models/Expense');
const BudgetAllocation = require('../models/BudgetAllocation');
const { calculatePolicyAllocation } = require('../services/suggestionPolicy');

const inferCategory = (title, userCategory) => {
  if (userCategory && userCategory !== 'Food & Dining') return userCategory;
  const t = String(title || '').toLowerCase();
  if (/\b(rent|lease|mortgage|apartment|house|room)\b/i.test(t)) return 'Housing';
  if (/\b(health|doctor|medicine|hospital|pharmacy|clinic|dental)\b/i.test(t)) return 'Healthcare';
  if (/\b(bus|train|fuel|petrol|diesel|uber|pickme|cab|taxi|transport|parking)\b/i.test(t)) return 'Transport';
  if (/\b(wifi|electricity|water|internet|bill|utility|phone|dialog|mobitel)\b/i.test(t)) return 'Utilities';
  if (/\b(game|movie|cinema|gym|trip|netflix|spotify|hobb(y|ies)|leisure)\b/i.test(t)) return 'Hobbies & Leisure';
  if (/\b(loan|debt|emi|credit|interest|installment)\b/i.test(t)) return 'Debt/Loan';
  if (/\b(food|lunch|dinner|breakfast|grocery|groceries|supermarket|restaurant|coffee|cafe|kottu|rice|pizza|burger)\b/i.test(t)) return 'Food & Dining';
  return userCategory || 'Food & Dining';
};

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
    const { title, amount, category, isRecurring = true } = req.body;
    if (!title || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ message: 'A title and positive amount are required.' });
    const finalCategory = inferCategory(title, category);
    const expense = await Expense.create({ tenantId: req.tenantId, userId: req.user._id, title, amount: Number(amount), category: finalCategory, isRecurring });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (amount !== undefined) update.amount = Number(amount);
    if (category !== undefined) update.category = category;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, tenantId: req.tenantId, userId: req.user._id },
      update,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense record not found.' });
    res.json(expense);
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

module.exports = { getFinancialSummary, addIncome, deleteIncome, addExpense, updateExpense, deleteExpense, updateBudgetAllocation };
