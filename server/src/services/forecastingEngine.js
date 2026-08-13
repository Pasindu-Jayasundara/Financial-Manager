/**
 * Produces a transparent forecast from the user's saved monthly income,
 * monthly expenses, income goal, target timeline, and roadmap completion.
 * It intentionally does not use a hidden, fixed growth percentage.
 */
const generate12MonthForecast = ({
  currentMonthlyIncome,
  currentMonthlyExpense,
  roadmapCompletionRate,
  savingsRate,
  skillCount,
  targetIncomeGoal,
  targetMonths = 12
}) => {
  const currentIncome = Math.max(0, Number(currentMonthlyIncome) || 0);
  const expenses = Math.max(0, Number(currentMonthlyExpense) || 0);
  const targetIncome = Math.max(0, Number(targetIncomeGoal) || currentIncome);
  const timelineMonths = Math.max(1, Number(targetMonths) || 12);
  const completion = Math.min(1, Math.max(0, Number(roadmapCompletionRate) || 0));
  const netSavingsRate = Math.min(1, Math.max(0, Number(savingsRate) || 0));
  const incomeGap = targetIncome - currentIncome;
  const rangePct = Math.max(0.05, 0.22 - (completion * 0.12));
  const months = [];
  let cumulativeSavingsMid = 0;

  for (let month = 1; month <= 12; month++) {
    const progress = Math.min(1, month / timelineMonths);
    const incomeMid = Math.round(currentIncome + (incomeGap * progress));
    const range = Math.abs(incomeGap) * rangePct * progress;
    const incomeLow = Math.max(0, Math.round(incomeMid - range));
    const incomeHigh = Math.round(incomeMid + range);
    const monthlyNetSavings = Math.max(0, (incomeMid - expenses) * netSavingsRate);
    cumulativeSavingsMid += Math.round(monthlyNetSavings);
    months.push({ month: `M${month}`, incomeLow, incomeMid, incomeHigh, cumulativeSavingsMid, targetGoal: targetIncome });
  }

  const finalMonth = months[months.length - 1];
  const confidenceScore = Math.round(55 + (completion * 35) + (skillCount > 0 ? 10 : 0));
  const factors = [
    `Current monthly income from saved records: Rs. ${currentIncome.toLocaleString()}`,
    `Target income and timeline: Rs. ${targetIncome.toLocaleString()} per month in ${timelineMonths} month${timelineMonths === 1 ? '' : 's'}`,
    `Roadmap completion: ${(completion * 100).toFixed(0)}% (controls the forecast range)`,
    `Current monthly net savings rate: ${(netSavingsRate * 100).toFixed(0)}%`
  ];

  return {
    forecastData: months,
    confidenceScore: Math.min(100, confidenceScore),
    projected12MonthRange: { low: finalMonth.incomeLow, mid: finalMonth.incomeMid, high: finalMonth.incomeHigh },
    totalProjectedSavings12M: cumulativeSavingsMid,
    explanationFactors: factors
  };
};

module.exports = { generate12MonthForecast };
