/**
 * In-Memory Mock Store Fallback for offline development
 */
let mockData = {
  user: {
    _id: 'user_alex_1',
    name: 'Alex Rivera',
    email: 'alex@riseup.io',
    age: 42,
    ageBand: '30-49',
    medicalConditions: ['chronic_condition_high_cost']
  },
  tenants: [
    { _id: 't_personal', name: 'Personal Workspace', type: 'personal' },
    { _id: 't_household', name: 'Rivera Household', type: 'household' }
  ],
  incomes: [
    { _id: 'inc_1', tenantId: 't_personal', source: 'Senior Consultant Salary', amount: 4800, isFixed: true },
    { _id: 'inc_2', tenantId: 't_personal', source: 'Freelance Advisory', amount: 1200, isFixed: false }
  ],
  expenses: [
    { _id: 'exp_1', tenantId: 't_personal', title: 'Apartment Rent', amount: 1800, category: 'Housing' },
    { _id: 'exp_2', tenantId: 't_personal', title: 'Health & Prescriptions', amount: 450, category: 'Healthcare' },
    { _id: 'exp_3', tenantId: 't_personal', title: 'Groceries & Dining', amount: 650, category: 'Food & Dining' },
    { _id: 'exp_4', tenantId: 't_personal', title: 'Car Loan & Fuel', amount: 400, category: 'Transport' },
    { _id: 'exp_5', tenantId: 't_personal', title: 'Hobbies & Streaming', amount: 120, category: 'Hobbies & Leisure' }
  ],
  budget: {
    tenantId: 't_personal',
    savingsPct: 15,
    loansPct: 15,
    familyPct: 20,
    dailyExpensesPct: 45,
    hobbiesPct: 5,
    policyApplied: {
      ageBand: '30-49',
      healthRiskTier: 'elevated_health_buffer',
      healthBufferPct: 15,
      notes: 'Health-aware policy active: Carved 15% health buffer due to chronic medical risk flags.'
    }
  },
  goal: {
    tenantId: 't_personal',
    targetIncome: 8500,
    declaredSkills: ['Financial Modeling', 'Data Analytics', 'Project Management'],
    matchedJobs: [
      { role: 'Lead Financial Strategist', industry: 'FinTech', estimatedSalary: 8800, matchPercentage: 75, gapSkills: ['Risk Management', 'Python'] },
      { role: 'Senior Analytics Manager', industry: 'Enterprise Software', estimatedSalary: 9200, matchPercentage: 80, gapSkills: ['SQL', 'Executive Reporting'] }
    ]
  },
  roadmaps: [
    {
      _id: 'rm_1',
      tenantId: 't_personal',
      month: 1,
      milestoneTitle: 'Month 1: Risk Management & Advanced Modeling Certification',
      targetIncomeIncrease: 500,
      isCompleted: true,
      blockchainVerified: true,
      blockchainTxHash: '0x7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      tasks: [
        { _id: 'task_1', text: 'Complete Enterprise Risk Management Course', category: 'Skill Acquisition', completed: true },
        { _id: 'task_2', text: 'Build Automated Healthcare Buffer Savings Rule', category: 'Health Buffer', completed: true },
        { _id: 'task_3', text: 'Set aside $1,200 in High-Yield Savings Account', category: 'Savings Target', completed: true }
      ]
    },
    {
      _id: 'rm_2',
      tenantId: 't_personal',
      month: 2,
      milestoneTitle: 'Month 2: Python Data Analytics & FinTech Application Prep',
      targetIncomeIncrease: 1000,
      isCompleted: false,
      blockchainVerified: false,
      tasks: [
        { _id: 'task_4', text: 'Complete Python for Finance Certification', category: 'Skill Acquisition', completed: false },
        { _id: 'task_5', text: 'Apply to 3 Lead Financial Strategist positions', category: 'Job Application', completed: false },
        { _id: 'task_6', text: 'Maintain 20% Net Savings rate target', category: 'Savings Target', completed: false }
      ]
    }
  ],
  notifications: {
    dailyMotivation: {
      completionPct: 35,
      message: 'Awesome work! You are 35% closer to your $8,500 monthly target goal. Complete Month 2 Python module!',
      suggestedNextAction: 'Complete your Python for Finance module to trigger your next milestone validation.'
    },
    notifications: [
      { title: 'Milestone Verified on Blockchain!', message: 'Month 1 milestone verified on-chain. TxHash: 0x7a8f9b2c...', type: 'milestone' }
    ]
  },
  blockchainRecords: [
    {
      recordType: 'milestone_completion',
      sourceId: 'rm_1',
      dataHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      txHash: '0x7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      blockNumber: 18492011,
      timestamp: new Date()
    }
  ]
};

module.exports = { mockData };
