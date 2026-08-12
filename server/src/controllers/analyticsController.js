const { generate12MonthForecast } = require('../services/forecastingEngine');
const { mockData } = require('../services/mockDataStore');

const getAnalyticsAndForecast = async (req, res) => {
  try {
    const totalIncome = mockData.incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = mockData.expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const spendBreakdown = [
      { category: 'Housing', amount: 1800, percentage: 53 },
      { category: 'Healthcare', amount: 450, percentage: 13 },
      { category: 'Food & Dining', amount: 650, percentage: 19 },
      { category: 'Transport', amount: 400, percentage: 12 },
      { category: 'Hobbies & Leisure', amount: 120, percentage: 3 }
    ];

    const forecast = generate12MonthForecast({
      currentMonthlyIncome: totalIncome,
      currentMonthlyExpense: totalExpense,
      roadmapCompletionRate: 0.75,
      savingsRate: 0.20,
      skillCount: mockData.goal.declaredSkills.length,
      targetIncomeGoal: mockData.goal.targetIncome
    });

    res.json({
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      spendBreakdown,
      forecast
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalyticsAndForecast };
