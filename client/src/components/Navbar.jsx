import React, { useState } from 'react';
import { Building2, Bell, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Navbar({ tenants, activeTenantId, onSelectTenant, user, notifications, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      gap: '20px'
    }}>
      {/* Multi-Tenant Workspace Selector */}
      <div className="glass-panel" style={{
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(2, 132, 199, 0.1)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <Building2 size={16} />
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Workspace (Tenant)
          </div>
          <select
            value={activeTenantId || ''}
            onChange={(e) => onSelectTenant(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'Outfit, sans-serif'
            }}
            id="tenant-select-dropdown"
          >
            {tenants.map(t => (
              <option key={t._id} value={t._id} style={{ background: '#ffffff', color: '#0f172a' }}>
                {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right User Bar & Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: '#ffffff',
              border: '1px solid var(--bg-card-border)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            id="notification-bell-btn"
          >
            <Bell size={18} />
            {notifications && notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '52px',
              right: '0',
              width: '320px',
              padding: '16px',
              zIndex: 1000,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Daily Goal Check-Ins</h4>
                <span className="badge badge-cyan">Live</span>
              </div>
              {notifications && notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <div key={i} style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    marginBottom: '8px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '2px' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{n.message}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No new alerts.</div>
              )}
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="glass-panel" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#fff',
            fontSize: '0.9rem'
          }}>
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Account'}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                Age {user?.age ?? '—'}
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                Health Risk Tier
              </span>
            </div>
          </div>
          <button className="btn-secondary" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}
