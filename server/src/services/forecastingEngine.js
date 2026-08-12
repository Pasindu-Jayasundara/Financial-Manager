/**
 * Forecasting Engine (ML/Analytics Service)
 * Generates explainable 12-month system-inferred financial position projection ranges
 * based on roadmap task completion pace, savings rate, skill acquisition, and age band.
 */

const generate12MonthForecast = ({
  currentMonthlyIncome = 3000,
  currentMonthlyExpense = 1800,
  roadmapCompletionRate = 0.75, // 0.0 to 1.0
  savingsRate = 0.20,
  skillCount = 3,
  targetIncomeGoal = 5500
}) => {
  const months = [];
  const baseGrowthFactor = 0.015 + (roadmapCompletionRate * 0.035) + (skillCount * 0.005);
  
  let projectedIncomeLow = currentMonthlyIncome;
  let projectedIncomeMid = currentMonthlyIncome;
  let projectedIncomeHigh = currentMonthlyIncome;

  let cumulativeSavingsLow = 0;
  let cumulativeSavingsMid = 0;
  let cumulativeSavingsHigh = 0;

  for (let month = 1; month <= 12; month++) {
    // Income growth curve accelerating with roadmap tasks done
    const growthMultLow = 1 + (baseGrowthFactor * 0.6 * month);
    const growthMultMid = 1 + (baseGrowthFactor * 1.0 * month);
    const growthMultHigh = 1 + (baseGrowthFactor * 1.45 * month);

    projectedIncomeLow = Math.round(currentMonthlyIncome * growthMultLow);
    projectedIncomeMid = Math.round(currentMonthlyIncome * growthMultMid);
    projectedIncomeHigh = Math.round(Math.min(targetIncomeGoal * 1.15, currentMonthlyIncome * growthMultHigh));

    // Net savings per month
    const monthlyNetSavingsMid = Math.max(0, (projectedIncomeMid - currentMonthlyExpense) * savingsRate);
    cumulativeSavingsLow += Math.round(monthlyNetSavingsMid * 0.7);
    cumulativeSavingsMid += Math.round(monthlyNetSavingsMid);
    cumulativeSavingsHigh += Math.round(monthlyNetSavingsMid * 1.3);

    months.push({
      month: `M${month}`,
      incomeLow: projectedIncomeLow,
      incomeMid: projectedIncomeMid,
      incomeHigh: projectedIncomeHigh,
      cumulativeSavingsMid,
      targetGoal: targetIncomeGoal
    });
  }

  const confidenceScore = Math.round(60 + (roadmapCompletionRate * 35));

  const explanationFactors = [
    `Roadmap Completion Pace: ${(roadmapCompletionRate * 100).toFixed(0)}% (+${(roadmapCompletionRate * 3.5).toFixed(1)}% monthly trajectory acceleration)`,
    `Active Skills Leveraged: ${skillCount} verified skills driving career progression`,
    `Current Net Savings Rate: ${(savingsRate * 100).toFixed(0)}% monthly reserve stability`,
    `Projected 12-Month Position Range: $${projectedIncomeLow.toLocaleString()} - $${projectedIncomeHigh.toLocaleString()} / mo`
  ];

  return {
    forecastData: months,
    confidenceScore,
    projected12MonthRange: {
      low: projectedIncomeLow,
      mid: projectedIncomeMid,
      high: projectedIncomeHigh
    },
    totalProjectedSavings12M: cumulativeSavingsMid,
    explanationFactors
  };
};

module.exports = { generate12MonthForecast };
