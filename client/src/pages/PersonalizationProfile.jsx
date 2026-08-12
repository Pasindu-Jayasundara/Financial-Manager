import React, { useState } from 'react';
import { UserCheck, Building2, HeartPulse, Plus, Check } from 'lucide-react';

export default function PersonalizationProfile({ user, tenants, onUpdateProfile, onCreateTenant }) {
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [age, setAge] = useState(user?.age || 42);
  const [medicalConditions, setMedicalConditions] = useState(user?.medicalConditions || ['chronic_condition_high_cost']);
  const [newCondition, setNewCondition] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Multi-Tenant form state
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantType, setNewTenantType] = useState('household');
  const [tenantMsg, setTenantMsg] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await onUpdateProfile({ name, age: Number(age), medicalConditions });
    setProfileMsg('Profile and personalization policy updated!');
    setTimeout(() => setProfileMsg(''), 4000);
  };

  const handleAddCondition = () => {
    if (!newCondition.trim() || medicalConditions.includes(newCondition.trim())) return;
    setMedicalConditions([...medicalConditions, newCondition.trim()]);
    setNewCondition('');
  };

  const handleRemoveCondition = (cond) => {
    setMedicalConditions(medicalConditions.filter(c => c !== cond));
  };

  const handleCreateTenantSubmit = async (e) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    await onCreateTenant({ name: newTenantName.trim(), type: newTenantType });
    setNewTenantName('');
    setTenantMsg(`Workspace "${newTenantName}" created!`);
    setTimeout(() => setTenantMsg(''), 4000);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Personalization & Multi-Tenancy Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Configure age, medical context policy rules, and create shared multi-tenant workspaces.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* User Profile & Health Policy Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--accent-cyan)" /> Personal Identity & Health Context
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="profile-name-input"
              />
            </div>

            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                id="profile-age-input"
              />
            </div>

            <div>
              <label className="form-label">Medical Conditions / Health Risk Context Flags</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. chronic_condition_high_cost"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  id="add-condition-input"
                />
                <button type="button" className="btn-secondary" onClick={handleAddCondition} id="add-condition-btn">
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {medicalConditions.map((c, i) => (
                  <span key={i} className="badge badge-rose" style={{ cursor: 'pointer', padding: '4px 10px' }} onClick={() => handleRemoveCondition(c)}>
                    {c} &times;
                  </span>
                ))}
              </div>
            </div>

            {profileMsg && (
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> {profileMsg}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} id="save-profile-btn">
              Save Health Context
            </button>
          </form>
        </div>

        {/* Multi-Tenant Workspaces Manager */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="var(--accent-purple)" /> Multi-Tenant Workspaces (Organizations)
          </h3>

          <form onSubmit={handleCreateTenantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">Workspace Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rivera Family Household, Tech Startup LLC"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                required
                id="create-tenant-name-input"
              />
            </div>

            <div>
              <label className="form-label">Workspace Type</label>
              <select
                className="form-input"
                value={newTenantType}
                onChange={(e) => setNewTenantType(e.target.value)}
                id="create-tenant-type-select"
              >
                <option value="household">Household / Family</option>
                <option value="business">Business / Organization</option>
                <option value="personal">Personal Project</option>
              </select>
            </div>

            {tenantMsg && (
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> {tenantMsg}
              </div>
            )}

            <button type="submit" className="btn-primary" id="create-tenant-btn">
              <Plus size={16} /> Create Workspace
            </button>
          </form>

          {/* Current Workspaces List */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Your Available Workspaces:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tenants.map((t) => (
                <div key={t._id} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid var(--bg-card-border)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {t.type}</div>
                  </div>
                  <span className="badge badge-purple">Active Member</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
