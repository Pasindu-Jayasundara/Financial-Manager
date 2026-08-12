import React from 'react';
import { TrendingUp, PieChart, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export default function AnalyticsForecasting({ analyticsData }) {
  const breakdown = analyticsData?.spendBreakdown || [
    { category: 'Housing', amount: 1800, percentage: 53 },
    { category: 'Healthcare', amount: 450, percentage: 13 },
    { category: 'Food & Dining', amount: 650, percentage: 19 },
    { category: 'Transport', amount: 400, percentage: 12 },
    { category: 'Hobbies & Leisure', amount: 120, percentage: 3 }
  ];

  const forecast = analyticsData?.forecast || {
    confidenceScore: 85,
    projected12MonthRange: { low: 6800, mid: 8200, high: 9400 },
    explanationFactors: [
      "Roadmap Completion Pace: 75% (+3.5% monthly trajectory acceleration)",
      "Active Skills Leveraged: 3 verified skills driving career progression",
      "Current Net Savings Rate: 20% monthly reserve stability"
    ],
    forecastData: [
      { month: 'M1', incomeMid: 6100, cumulativeSavingsMid: 800 },
      { month: 'M3', incomeMid: 6500, cumulativeSavingsMid: 2600 },
      { month: 'M6', incomeMid: 7200, cumulativeSavingsMid: 5900 },
      { month: 'M9', incomeMid: 7800, cumulativeSavingsMid: 9800 },
      { month: 'M12', incomeMid: 8500, cumulativeSavingsMid: 14200 }
    ]
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Analytics & Predictive Forecasting</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          ML-driven financial position projection and deterministic spend breakdowns.
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
                    ${item.amount.toLocaleString()} ({item.percentage}%)
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
          </div>
        </div>

        {/* ML Forecast Summary Card */}
        <div className="glass-panel glass-panel-glow" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent-cyan)" /> System-Inferred ML Position Forecast
            </h3>
            <span className="badge badge-cyan">{forecast.confidenceScore}% Confidence</span>
          </div>

          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--bg-card-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Projected 12-Month Monthly Income Range
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>
              ${forecast.projected12MonthRange.low.toLocaleString()} &ndash; ${forecast.projected12MonthRange.high.toLocaleString()} / mo
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Midpoint Expected: ${forecast.projected12MonthRange.mid.toLocaleString()} / month
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--accent-purple)', marginBottom: '8px' }}>Explainable Model Factors:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(forecast.explanationFactors || []).map((factor, fidx) => (
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
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${forecast.forecastData.length}, 1fr)`, gap: '16px', alignItems: 'end', height: '220px', padding: '16px 0', borderBottom: '1px solid var(--bg-card-border)' }}>
          {forecast.forecastData.map((d, idx) => {
            const heightPct = Math.min(100, Math.max(20, (d.incomeMid / 10000) * 100));
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                  ${(d.incomeMid / 1000).toFixed(1)}k
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
        </div>
      </div>
    </div>
  );
}
