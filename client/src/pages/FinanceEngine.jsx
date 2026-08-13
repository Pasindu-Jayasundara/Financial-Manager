import React, { useState } from 'react';
import { Plus, Trash2, ShieldAlert, Check, RefreshCw, DollarSign, PiggyBank, Heart } from 'lucide-react';

export default function FinanceEngine({ financeData, onAddIncome, onDeleteIncome, onAddExpense, onDeleteExpense, onUpdateBudget }) {
  const incomes = financeData?.incomes || [];
  const expenses = financeData?.expenses || [];
  const budget = financeData?.budget || {
    savingsPct: 20,
    loansPct: 15,
    familyPct: 20,
    dailyExpensesPct: 35,
    hobbiesPct: 10
  };

  // Income form state
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incIsFixed, setIncIsFixed] = useState(true);

  // Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food & Dining');

  // Budget sliders state
  const [savingsPct, setSavingsPct] = useState(budget.savingsPct);
  const [loansPct, setLoansPct] = useState(budget.loansPct);
  const [familyPct, setFamilyPct] = useState(budget.familyPct);
  const [dailyExpensesPct, setDailyExpensesPct] = useState(budget.dailyExpensesPct);
  const [hobbiesPct, setHobbiesPct] = useState(budget.hobbiesPct);
  const [budgetSuccessMsg, setBudgetSuccessMsg] = useState('');

  const totalPct = Number(savingsPct) + Number(loansPct) + Number(familyPct) + Number(dailyExpensesPct) + Number(hobbiesPct);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!incSource || !incAmount) return;
    onAddIncome({ source: incSource, amount: Number(incAmount), isFixed: incIsFixed });
    setIncSource('');
    setIncAmount('');
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    onAddExpense({ title: expTitle, amount: Number(expAmount), category: expCategory });
    setExpTitle('');
    setExpAmount('');
  };

  const handleSaveBudget = async () => {
    const res = await onUpdateBudget({
      savingsPct: Number(savingsPct),
      loansPct: Number(loansPct),
      familyPct: Number(familyPct),
      dailyExpensesPct: Number(dailyExpensesPct),
      hobbiesPct: Number(hobbiesPct)
    });
    setBudgetSuccessMsg('Budget allocation updated successfully!');
    setTimeout(() => setBudgetSuccessMsg(''), 4000);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Finance Engine</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Manage income sources, current expenses, and configure your 5-bucket policy allocation.
        </p>
      </div>

      {/* Income & Expense Forms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Income Management Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="var(--accent-cyan)" /> Income Sources
          </h3>

          <form onSubmit={handleIncomeSubmit} style={{ marginBottom: '20px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Source (e.g. Salary, Freelance)"
                value={incSource}
                onChange={(e) => setIncSource(e.target.value)}
                required
                id="income-source-input"
              />
              <input
                type="number"
                className="form-input"
                placeholder="Amount (Rs.)"
                value={incAmount}
                onChange={(e) => setIncAmount(e.target.value)}
                required
                id="income-amount-input"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={incIsFixed}
                  onChange={(e) => setIncIsFixed(e.target.checked)}
                />
                Fixed Regular Income
              </label>
              <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} id="add-income-btn">
                <Plus size={16} /> Add Income
              </button>
            </div>
          </form>

          {/* Income List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {incomes.map((inc) => (
              <div key={inc._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid var(--bg-card-border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{inc.source}</div>
                  <span className={`badge ${inc.isFixed ? 'badge-cyan' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                    {inc.isFixed ? 'Fixed' : 'Variable'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '1rem' }}>
                    +Rs. {inc.amount.toLocaleString()}
                  </span>
                  <button className="btn-outline-danger" onClick={() => onDeleteIncome(inc._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Management Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PiggyBank size={20} color="var(--accent-amber)" /> Current Expenses
          </h3>

          <form onSubmit={handleExpenseSubmit} style={{ marginBottom: '20px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Expense (e.g. Rent, Health)"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                required
                id="expense-title-input"
              />
              <input
                type="number"
                className="form-input"
                placeholder="Amount (Rs.)"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                required
                id="expense-amount-input"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-input"
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                id="expense-category-select"
              >
                <option value="Housing">Housing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Hobbies & Leisure">Hobbies & Leisure</option>
                <option value="Debt/Loan">Debt/Loan</option>
              </select>
              <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} id="add-expense-btn">
                <Plus size={16} /> Add Expense
              </button>
            </div>
          </form>

          {/* Expense List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {expenses.map((exp) => (
              <div key={exp._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid var(--bg-card-border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{exp.title}</div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                    {exp.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '1rem' }}>
                    -Rs. {exp.amount.toLocaleString()}
                  </span>
                  <button className="btn-outline-danger" onClick={() => onDeleteExpense(exp._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Bucket Policy Sliders */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>5-Bucket Allocation Engine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Split income across Savings, Loans, Family, Daily Expenses, and Hobbies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: totalPct === 100 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
            }}>
              Total: {totalPct}%
            </span>
            <button
              className="btn-primary"
              onClick={handleSaveBudget}
              disabled={totalPct !== 100}
              style={{ opacity: totalPct === 100 ? 1 : 0.5 }}
              id="save-budget-btn"
            >
              <RefreshCw size={16} /> Save Allocation
            </button>
          </div>
        </div>

        {totalPct !== 100 && (
          <div style={{
            background: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            padding: '10px 14px',
            borderRadius: '8px',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={18} /> Allocation percentages must add up to exactly 100%. (Currently {totalPct}%)
          </div>
        )}

        {budgetSuccessMsg && (
          <div style={{
            background: 'rgba(5, 150, 105, 0.08)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            padding: '10px 14px',
            borderRadius: '8px',
            color: 'var(--accent-emerald)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} /> {budgetSuccessMsg}
          </div>
        )}

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <label className="form-label">Savings Bucket: {savingsPct}%</label>
            <input
              type="range"
              min="5"
              max="50"
              value={savingsPct}
              onChange={(e) => setSavingsPct(e.target.value)}
              style={{ width: '100%' }}
              id="slider-savings"
            />
          </div>

          <div>
            <label className="form-label">Loans Bucket: {loansPct}%</label>
            <input
              type="range"
              min="5"
              max="40"
              value={loansPct}
              onChange={(e) => setLoansPct(e.target.value)}
              style={{ width: '100%' }}
              id="slider-loans"
            />
          </div>

          <div>
            <label className="form-label">Family Bucket: {familyPct}%</label>
            <input
              type="range"
              min="5"
              max="40"
              value={familyPct}
              onChange={(e) => setFamilyPct(e.target.value)}
              style={{ width: '100%' }}
              id="slider-family"
            />
          </div>

          <div>
            <label className="form-label">Daily / Health: {dailyExpensesPct}%</label>
            <input
              type="range"
              min="15"
              max="60"
              value={dailyExpensesPct}
              onChange={(e) => setDailyExpensesPct(e.target.value)}
              style={{ width: '100%' }}
              id="slider-daily"
            />
          </div>

          <div>
            <label className="form-label">Hobbies Bucket: {hobbiesPct}%</label>
            <input
              type="range"
              min="0"
              max="30"
              value={hobbiesPct}
              onChange={(e) => setHobbiesPct(e.target.value)}
              style={{ width: '100%' }}
              id="slider-hobbies"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
