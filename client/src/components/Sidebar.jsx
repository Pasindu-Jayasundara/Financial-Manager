import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance Engine', icon: Wallet },
    { id: 'roadmap', label: 'Goal & Roadmap', icon: Target },
    { id: 'analytics', label: 'Analytics & ML', icon: TrendingUp },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: ShieldCheck },
    { id: 'profile', label: 'Profile & Tenants', icon: UserCheck }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '8px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
        }}>
          <Sparkles size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>RiseUp</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Financial Manager
          </span>
        </div>
      </div>

      {/* Nav menu */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              id={`nav-${item.id}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="glass-panel" style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
          Multi-Tenancy Active
        </div>
        <div>SHA-256 Verified Ledger</div>
      </div>
    </aside>
  );
}
