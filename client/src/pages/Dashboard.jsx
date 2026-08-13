import React from 'react';
import { Wallet, TrendingUp, Target, ShieldCheck, HeartPulse, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ financeData, goalData, analyticsData, notifications, setActiveTab }) {
  const summary = financeData || { totalIncome: 0, totalExpense: 0, netCashflow: 0 };
  const goal = goalData?.goal;
  const tasks = (goalData?.roadmaps || []).flatMap(item => item.tasks || []);
  const completionPct = tasks.length ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0;
  const dailyMotivation = notifications?.[0] || { message: goal ? `Your target monthly income is Rs. ${Number(goal.targetIncome).toLocaleString()}.` : 'Add a financial goal to begin tracking your progress.' };
  const budget = summary.budget || {};

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '24px 28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">AI Motivation Engine</span>
              <span className="badge badge-emerald">Daily Status</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
              How close are you to your target income?
            </h1>
            <p style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 500, maxWidth: '650px', lineHeight: 1.5 }}>
              {dailyMotivation.message}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setActiveTab('roadmap')} id="dashboard-go-roadmap-btn">
            <Target size={18} />
            View Career Roadmap
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>Goal Progression Pace</span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>{completionPct}% Completed</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Monthly Income</span>
            <Wallet size={20} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Rs. {summary.totalIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> Fixed & Variable Sources
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Monthly Expenses</span>
            <TrendingUp size={20} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Rs. {summary.totalExpense.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Across 5 Budget Buckets
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Net Monthly Reserve</span>
            <Sparkles size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: summary.netCashflow >= 0 ? '#059669' : '#e11d48' }}>
            Rs. {summary.netCashflow.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
            Available for Goals & Savings
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Blockchain Ledger</span>
            <ShieldCheck size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Verified
          </div>
          <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600, marginTop: '4px' }}>
            Immutable SHA-256 Commitments
          </div>
        </div>
      </div>

      {/* 5 Bucket Split Card & Age Context */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* 5-Bucket Allocation Bar */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>5-Bucket Budget Allocation (Policy-Adjusted)</h3>
            <button className="btn-secondary" onClick={() => setActiveTab('finance')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Adjust Buckets
            </button>
          </div>

          {/* Allocation Breakdown items */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(2, 132, 199, 0.18)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Savings</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
                {budget.savingsPct ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                Rs. {Math.round(summary.totalIncome * ((budget.savingsPct ?? 0) / 100))}
              </div>
            </div>

            <div style={{ background: 'rgba(124, 58, 237, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(124, 58, 237, 0.18)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Loans</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7c3aed', margin: '4px 0' }}>
                {budget.loansPct ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                Rs. {Math.round(summary.totalIncome * ((budget.loansPct ?? 0) / 100))}
              </div>
            </div>

            <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.18)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Family</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
                {budget.familyPct ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                Rs. {Math.round(summary.totalIncome * ((budget.familyPct ?? 0) / 100))}
              </div>
            </div>

            <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(5, 150, 105, 0.18)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Daily / Health</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                {budget.dailyExpensesPct ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                Rs. {Math.round(summary.totalIncome * ((budget.dailyExpensesPct ?? 0) / 100))}
              </div>
            </div>

            <div style={{ background: 'rgba(217, 119, 6, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(217, 119, 6, 0.18)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Hobbies</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>
                {budget.hobbiesPct ?? 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                Rs. {Math.round(summary.totalIncome * ((budget.hobbiesPct ?? 0) / 100))}
              </div>
            </div>
          </div>
        </div>

        {/* Health Risk & Policy Context */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HeartPulse size={20} color="#e11d48" />
            <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>Personalization Policy</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
            {summary.budget?.policyApplied?.notes || 'Your allocation will appear after your profile is loaded.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge badge-purple">Derived Health Context</span>
            <span className="badge badge-cyan">Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
