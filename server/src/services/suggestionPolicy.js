/**
 * SuggestionPolicy Engine
 * Calculates age and medical condition aware budget allocations (5 buckets: Savings, Loans, Family, Daily Expenses/Health, Hobbies)
 * Section 5 in architecture.md: Keep as policy layer, expose derived flags, advisory warning if essential coverage drops.
 */

const calculatePolicyAllocation = (user, totalIncome = 0) => {
  const age = user?.age || 30;
  const conditions = user?.medicalConditions || [];
  
  const hasHighMedicalRisk = conditions.some(c => 
    ['chronic_condition_high_cost', 'diabetic', 'cardiovascular', 'elderly_care'].includes(c.toLowerCase())
  );

  let savingsPct = 20;
  let loansPct = 15;
  let familyPct = 20;
  let dailyExpensesPct = 35;
  let hobbiesPct = 10;
  let healthBufferPct = 5;

  let notes = "Standard policy allocation (Balanced 20/15/20/35/10)";
  let riskTier = "low";

  if (age >= 50 || hasHighMedicalRisk) {
    riskTier = "elevated_health_buffer";
    healthBufferPct = hasHighMedicalRisk ? 15 : 10;
    
    // Carve extra health/daily expense buffer from hobbies & savings
    dailyExpensesPct = 40 + (hasHighMedicalRisk ? 5 : 0); // 40% - 45%
    hobbiesPct = 5;
    savingsPct = 15;
    familyPct = 20;
    loansPct = 15;

    notes = `Health-aware policy active: Carved ${healthBufferPct}% health/essential buffer due to ${age >= 50 ? 'age band (' + age + ')' : ''} ${hasHighMedicalRisk ? 'and medical risk flags' : ''}.`;
  }

  const totals = {
    savingsPct,
    loansPct,
    familyPct,
    dailyExpensesPct,
    hobbiesPct,
    totalIncome,
    policyApplied: {
      ageBand: user?.ageBand || (age >= 50 ? '50-64' : '30-49'),
      healthRiskTier: riskTier,
      healthBufferPct,
      notes
    }
  };

  return totals;
};

module.exports = { calculatePolicyAllocation };
