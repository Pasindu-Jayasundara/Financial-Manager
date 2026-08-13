const generateJobMatches = (declaredSkills = [], targetIncome = 100000) => {
  const userSkills = declaredSkills.map(s => String(s).trim().toLowerCase());
  const skillList = declaredSkills.length > 0 ? declaredSkills : ['General Professional'];

  const catalog = [
    {
      role: 'Full-Stack Developer',
      industry: 'Software & Technology',
      baseSalary: Math.max(targetIncome, 95000),
      required: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']
    },
    {
      role: 'Backend / Data Engineer',
      industry: 'Fintech & Cloud Systems',
      baseSalary: Math.max(Math.round(targetIncome * 1.1), 110000),
      required: ['Python', 'SQL', 'AWS', 'Docker', 'API Design']
    },
    {
      role: 'Technical Product Specialist',
      industry: 'Enterprise Solutions',
      baseSalary: Math.max(Math.round(targetIncome * 0.95), 85000),
      required: ['Project Management', 'Data Analysis', 'SQL', 'Communication']
    }
  ];

  return catalog.map(job => {
    const matched = job.required.filter(req => userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)));
    const gapSkills = job.required.filter(req => !userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)));
    const matchPercentage = declaredSkills.length > 0 
      ? Math.min(95, Math.max(45, Math.round((matched.length / job.required.length) * 100)))
      : 60;
    return {
      role: job.role,
      industry: job.industry,
      estimatedSalary: job.baseSalary,
      requiredSkills: job.required,
      gapSkills: gapSkills.length > 0 ? gapSkills : ['Advanced Architecture'],
      matchPercentage
    };
  });
};

const buildRoadmap = (goal) => {
  const months = Math.max(1, Math.min(Number(goal.targetMonths) || 12, 12));
  const currentInc = Number(goal.currentIncome || 0);
  const targetInc = Number(goal.targetIncome || 100000);
  const incomeGap = Math.max(0, targetInc - currentInc);
  const increasePerMonth = Math.round(incomeGap / months);

  const skills = (goal.declaredSkills && goal.declaredSkills.length > 0)
    ? goal.declaredSkills
    : ['Career Development'];

  const s1 = skills[0] || 'Primary Skill';
  const s2 = skills[1] || 'Secondary Skill';
  const s3 = skills[2] || 'Advanced Skill';

  const monthlyTemplates = [
    {
      title: `Month 1: Foundation & ${s1} Skill Audit`,
      tasks: [
        { text: `Audit baseline competence in ${s1} and document skill gaps`, category: 'Skill Acquisition' },
        { text: `Calculate monthly net cashflow & allocate emergency reserve`, category: 'Savings Target' },
        { text: `Update profile with target income goal of Rs. ${targetInc.toLocaleString()}`, category: 'Career Strategy' }
      ]
    },
    {
      title: `Month 2: Core Project Implementation with ${s1}`,
      tasks: [
        { text: `Build a practical hands-on portfolio project using ${s1}`, category: 'Skill Acquisition' },
        { text: `Optimize savings rate toward your monthly reserve target`, category: 'Savings Target' },
        { text: `Join 2 professional communities relevant to ${s1}`, category: 'Networking' }
      ]
    },
    {
      title: `Month 3: Secondary Skill Integration (${s2})`,
      tasks: [
        { text: `Complete core tutorials & practical exercises in ${s2}`, category: 'Skill Acquisition' },
        { text: `Review budget allocation percentages and eliminate leakages`, category: 'Savings Target' },
        { text: `Connect with 5 industry peers or recruiters on LinkedIn`, category: 'Networking' }
      ]
    },
    {
      title: `Month 4: Resume & Portfolio Showcase`,
      tasks: [
        { text: `Publish completed ${s1} and ${s2} projects to GitHub / portfolio`, category: 'Skill Acquisition' },
        { text: `Lock in +Rs. ${increasePerMonth.toLocaleString()}/mo incremental savings`, category: 'Savings Target' },
        { text: `Tailor resume and LinkedIn headline for target job roles`, category: 'Job Application' }
      ]
    },
    {
      title: `Month 5: Technical & Problem-Solving Drills`,
      tasks: [
        { text: `Practice technical coding / system design challenges weekly`, category: 'Skill Acquisition' },
        { text: `Evaluate monthly expense trends against 5-bucket targets`, category: 'Savings Target' },
        { text: `Conduct 2 mock technical interviews with peers or mentors`, category: 'Job Application' }
      ]
    },
    {
      title: `Month 6: Mid-Point Career Outreach & Applications`,
      tasks: [
        { text: `Apply to 5 targeted roles offering Rs. ${targetInc.toLocaleString()}/mo`, category: 'Job Application' },
        { text: `Re-invest incremental income into skill certifications`, category: 'Savings Target' },
        { text: `Request referral recommendations from professional network`, category: 'Networking' }
      ]
    },
    {
      title: `Month 7: Advanced Skill Mastery (${s3})`,
      tasks: [
        { text: `Master advanced topic in ${s3} or industry certifications`, category: 'Skill Acquisition' },
        { text: `Maintain target monthly savings rate discipline`, category: 'Savings Target' },
        { text: `Follow up on open job applications and recruitment leads`, category: 'Job Application' }
      ]
    },
    {
      title: `Month 8: Interview Loop Acceleration`,
      tasks: [
        { text: `Complete technical assessments and screening interviews`, category: 'Job Application' },
        { text: `Audit 6-month wealth growth and income trajectory`, category: 'Savings Target' },
        { text: `Refine value proposition and salary expectation pitch`, category: 'Career Strategy' }
      ]
    },
    {
      title: `Month 9: Offer Scouting & Compensation Benchmarking`,
      tasks: [
        { text: `Benchmark salary offers against industry standards`, category: 'Career Strategy' },
        { text: `Verify milestone completion records on blockchain ledger`, category: 'Verification' },
        { text: `Advance to final-round managerial and culture interviews`, category: 'Job Application' }
      ]
    },
    {
      title: `Month 10: Offer Negotiation & Value Leverage`,
      tasks: [
        { text: `Negotiate compensation packages to reach Rs. ${targetInc.toLocaleString()}/mo`, category: 'Career Strategy' },
        { text: `Finalize budget plan for new target income bracket`, category: 'Savings Target' },
        { text: `Review contract details and growth trajectory terms`, category: 'Job Application' }
      ]
    },
    {
      title: `Month 11: Transition & Onboarding Preparation`,
      tasks: [
        { text: `Prepare transition plan for new role or internal promotion`, category: 'Career Strategy' },
        { text: `Lock in 20%+ monthly income reserve allocation`, category: 'Savings Target' },
        { text: `Set up initial 30-60-90 day goals for target role`, category: 'Skill Acquisition' }
      ]
    },
    {
      title: `Month 12: Reach target Rs. ${targetInc.toLocaleString()} monthly income goal`,
      tasks: [
        { text: `Achieve target monthly income of Rs. ${targetInc.toLocaleString()}`, category: 'Goal Achievement' },
        { text: `Automate 5-bucket budget allocations for long-term wealth`, category: 'Savings Target' },
        { text: `Commit final milestone completion to immutable blockchain`, category: 'Verification' }
      ]
    }
  ];

  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const template = monthlyTemplates[index] || monthlyTemplates[monthlyTemplates.length - 1];

    return {
      tenantId: goal.tenantId,
      goalId: goal._id,
      month,
      milestoneTitle: template.title,
      targetIncomeIncrease: increasePerMonth,
      tasks: template.tasks.map(t => ({
        text: t.text,
        category: t.category,
        completed: false
      }))
    };
  });
};

module.exports = { buildRoadmap, generateJobMatches };
