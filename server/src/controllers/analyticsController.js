const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const Roadmap = require('../models/Roadmap');
const { generate12MonthForecast } = require('../services/forecastingEngine');

const getAnalyticsAndForecast = async (req, res) => {
  try {
    const [incomes, expenses, goal] = await Promise.all([
      Income.find({ tenantId: req.tenantId, userId: req.user._id }),
      Expense.find({ tenantId: req.tenantId, userId: req.user._id }),
      Goal.findOne({ tenantId: req.tenantId, userId: req.user._id })
    ]);
    const roadmaps = await Roadmap.find({ tenantId: req.tenantId }).sort({ month: 1 });
    const monthlyIncome = (income) => {
      if (income.frequency === 'weekly') return (income.amount * 52) / 12;
      if (income.frequency === 'annually') return income.amount / 12;
      return income.amount;
    };
    const totalIncomeFromRecords = incomes.reduce((sum, item) => sum + monthlyIncome(item), 0);
    const effectiveMonthlyIncome = totalIncomeFromRecords > 0 ? totalIncomeFromRecords : (goal?.currentIncome || 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const byCategory = expenses.reduce((map, item) => {
      map[item.category] = (map[item.category] || 0) + item.amount;
      return map;
    }, {});
    const spendBreakdown = Object.entries(byCategory)
      .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100, percentage: totalExpense ? Math.round((amount / totalExpense) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount);
    const tasks = roadmaps.flatMap(item => item.tasks || []);
    const completionRate = tasks.length ? tasks.filter(task => task.completed).length / tasks.length : 0;
    const targetIncomeGoal = (goal?.targetIncome && goal.targetIncome > 0) ? goal.targetIncome : Math.round((effectiveMonthlyIncome || 50000) * 1.25);
    const forecast = (effectiveMonthlyIncome > 0 || targetIncomeGoal > 0) ? generate12MonthForecast({
      currentMonthlyIncome: effectiveMonthlyIncome,
      currentMonthlyExpense: totalExpense,
      roadmapCompletionRate: completionRate,
      savingsRate: effectiveMonthlyIncome > 0 ? Math.max(0, (effectiveMonthlyIncome - totalExpense) / effectiveMonthlyIncome) : 0,
      skillCount: goal?.declaredSkills?.length || 0,
      targetIncomeGoal: targetIncomeGoal,
      targetMonths: goal?.targetMonths || 12
    }) : null;
    res.json({
      totalIncome: Math.round(effectiveMonthlyIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netSavings: Math.round((effectiveMonthlyIncome - totalExpense) * 100) / 100,
      spendBreakdown,
      forecast,
      dataSources: { incomeRecords: incomes.length, expenseRecords: expenses.length, roadmapTasks: tasks.length, completedTasks: tasks.filter(task => task.completed).length, goalConfigured: Boolean(goal) }
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getAnalyticsAndForecast };
