import React from 'react';
import { TrendingUp, PieChart, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export default function AnalyticsForecasting({ analyticsData }) {
  const breakdown = analyticsData?.spendBreakdown || [];
  const forecast = analyticsData?.forecast;
  const forecastData = forecast?.forecastData || [];
  const chartMaximum = Math.max(...forecastData.map(item => item.incomeMid), 1);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Analytics & Predictive Forecasting</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Live projection from {analyticsData?.dataSources?.incomeRecords || 0} income record(s), {analyticsData?.dataSources?.expenseRecords || 0} expense record(s), and {analyticsData?.dataSources?.roadmapTasks || 0} roadmap task(s) in this workspace.
        </p>
      </div>

      {/* Spend Breakdown & ML Model Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Spend Breakdown Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="var(--accent-amber)" /> Spend Breakdown by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {breakdown.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.category}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Rs. {item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: i % 2 === 0 ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #d97706, #e11d48)'
                    }}
                  />
                </div>
              </div>
            ))}
            {!breakdown.length && <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Add expenses in Finance Engine to see your category breakdown.</div>}
          </div>
        </div>

        {/* ML Forecast Summary Card */}
        <div className="glass-panel glass-panel-glow" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent-cyan)" /> System-Inferred ML Position Forecast
            </h3>
            <span className="badge badge-cyan">{forecast ? `${forecast.confidenceScore}% Confidence` : 'Awaiting income data'}</span>
          </div>

          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--bg-card-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Projected Monthly Income at Month 12
            </div>
            {forecast ? <><div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>
              Rs. {forecast.projected12MonthRange.low.toLocaleString()} &ndash; Rs. {forecast.projected12MonthRange.high.toLocaleString()} / mo
            </div><div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Midpoint Expected: Rs. {forecast.projected12MonthRange.mid.toLocaleString()} / month
            </div></> : <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Add an income record in Finance Engine to create a forecast.</div>}
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--accent-purple)', marginBottom: '8px' }}>Explainable Model Factors:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(forecast?.explanationFactors || []).map((factor, fidx) => (
                <div key={fidx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                  {factor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Trajectory Chart Visualizer */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--accent-emerald)" /> 12-Month Financial Trajectory Forecast
        </h3>

        {/* Trajectory Bar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: forecastData.length ? `repeat(${forecastData.length}, 1fr)` : '1fr', gap: '16px', alignItems: 'end', height: '220px', padding: '16px 0', borderBottom: '1px solid var(--bg-card-border)' }}>
          {forecastData.map((d, idx) => {
            const heightPct = Math.max(12, (d.incomeMid / chartMaximum) * 100);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                  Rs. {(d.incomeMid / 1000).toFixed(1)}k
                </div>
                <div style={{
                  width: '80%',
                  height: `${heightPct}%`,
                  background: 'var(--gradient-primary)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
                  transition: 'height 0.3s ease'
                }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {d.month}
                </div>
              </div>
            );
          })}
          {!forecastData.length && <div style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>Add income and a target goal to generate your forecast.</div>}
        </div>
      </div>
    </div>
  );
}
