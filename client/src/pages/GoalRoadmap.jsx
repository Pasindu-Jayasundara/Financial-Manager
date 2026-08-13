import React, { useState, useEffect } from 'react';
import { Target, Briefcase, CheckSquare, Square, ShieldCheck, Sparkles, Award } from 'lucide-react';

export default function GoalRoadmap({ goalData, onToggleTask, onUpdateGoal }) {
  const goal = goalData?.goal || { targetIncome: '', declaredSkills: [], matchedJobs: [] };
  const roadmaps = goalData?.roadmaps || [];

  const [targetInc, setTargetInc] = useState(goal.targetIncome || '');
  const [newSkill, setNewSkill] = useState('');
  const [declaredSkills, setDeclaredSkills] = useState(goal.declaredSkills || []);

  useEffect(() => {
    if (goalData?.goal) {
      if (goalData.goal.targetIncome !== undefined) setTargetInc(goalData.goal.targetIncome);
      if (goalData.goal.declaredSkills) setDeclaredSkills(goalData.goal.declaredSkills);
    }
  }, [goalData]);

  const handleAddSkill = () => {
    if (!newSkill.trim() || declaredSkills.includes(newSkill.trim())) return;
    const updated = [...declaredSkills, newSkill.trim()];
    setDeclaredSkills(updated);
    setNewSkill('');
    onUpdateGoal({ targetIncome: targetInc, declaredSkills: updated });
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = declaredSkills.filter(s => s !== skillToRemove);
    setDeclaredSkills(updated);
    onUpdateGoal({ targetIncome: targetInc, declaredSkills: updated });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Goal & Career Roadmap Engine</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Match your skills to target job roles and complete monthly tasks to bridge the income gap.
        </p>
      </div>

      {/* Target Goal & Skill Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Goal Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--accent-cyan)" /> Target Monthly Income Goal
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Rs.</span>
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '42px', fontSize: '1.2rem', fontWeight: 700 }}
                value={targetInc}
                onChange={(e) => setTargetInc(e.target.value)}
                id="target-income-input"
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => onUpdateGoal({ targetIncome: targetInc, declaredSkills })}
              id="save-goal-btn"
            >
              Update Goal
            </button>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            System automatically adjusts 12-month milestone tasks based on your income target delta.
          </div>
        </div>

        {/* Skills Selector */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--accent-purple)" /> Declared Career Skills
          </h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add skill (e.g. Python, AWS, SQL)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              id="add-skill-input"
            />
            <button className="btn-secondary" onClick={handleAddSkill} id="add-skill-btn">
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {declaredSkills.map((s, idx) => (
              <span key={idx} className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => handleRemoveSkill(s)}>
                {s} &times;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill / Job Matcher Section */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={20} color="var(--accent-emerald)" /> Job Market Matching & Skill Gap Analysis
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {(goal.matchedJobs || []).map((job, i) => (
            <div key={i} style={{
              background: '#ffffff',
              border: '1px solid var(--bg-card-border)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>{job.role}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.industry}</span>
                </div>
                <span className={`badge ${job.matchPercentage >= 70 ? 'badge-emerald' : 'badge-amber'}`}>
                  {job.matchPercentage}% Match
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                Est. Rs. {job.estimatedSalary.toLocaleString()} / mo
              </div>

              {job.gapSkills && job.gapSkills.length > 0 && (
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>Required Skill Gaps: </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {job.gapSkills.map((gs, gidx) => (
                      <span key={gidx} className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                        + {gs}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {!goal.matchedJobs?.length && <p style={{ color: 'var(--text-muted)' }}>No job matches have been saved for this goal yet.</p>}
        </div>
      </div>

      {/* Monthly Roadmap Milestones */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-cyan)" /> Generated Milestone Roadmap
          </h3>
          <span className="badge badge-cyan">Automated Progression Engine</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {roadmaps.map((rm) => (
            <div key={rm._id} style={{
              background: '#ffffff',
              border: rm.isCompleted ? '1px solid rgba(5, 150, 105, 0.4)' : '1px solid var(--bg-card-border)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{rm.milestoneTitle}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Target Income Boost: +Rs. {rm.targetIncomeIncrease} / mo
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {rm.blockchainVerified && (
                    <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Blockchain Verified
                    </span>
                  )}
                  <span className={`badge ${rm.isCompleted ? 'badge-emerald' : 'badge-amber'}`}>
                    {rm.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Tasks checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rm.tasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => onToggleTask(rm._id, task._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: task.completed ? 'rgba(5, 150, 105, 0.06)' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    id={`task-toggle-${task._id}`}
                  >
                    {task.completed ? (
                      <CheckSquare size={18} color="var(--accent-emerald)" />
                    ) : (
                      <Square size={18} color="var(--text-muted)" />
                    )}
                    <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {task.text}
                    </div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>

              {rm.blockchainTxHash && (
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', marginTop: '12px', fontFamily: 'monospace' }}>
                  Cryptographic Commitment TxHash: {rm.blockchainTxHash}
                </div>
              )}
            </div>
          ))}
          {!roadmaps.length && <p style={{ color: 'var(--text-muted)' }}>No roadmap milestones have been created yet.</p>}
        </div>
      </div>
    </div>
  );
}
