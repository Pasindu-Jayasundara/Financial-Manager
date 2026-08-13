import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FinanceEngine from './pages/FinanceEngine';
import GoalRoadmap from './pages/GoalRoadmap';
import AnalyticsForecasting from './pages/AnalyticsForecasting';
import BlockchainLedger from './pages/BlockchainLedger';
import PersonalizationProfile from './pages/PersonalizationProfile';
import AuthPage from './pages/AuthPage';
import { apiRequest } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [activeTenantId, setActiveTenantId] = useState('');
  const [financeData, setFinanceData] = useState(null);
  const [goalData, setGoalData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [ledgerRecords, setLedgerRecords] = useState([]);

  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const { response, data } = await apiRequest(endpoint, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(activeTenantId ? { 'x-tenant-id': activeTenantId } : {}), ...(options.headers || {}) } });
    if (response.status === 401) { localStorage.removeItem('authToken'); setToken(null); return null; }
    if (!response.ok) throw new Error(data?.message || 'Request failed.');
    return data;
  }, [token, activeTenantId]);

  const loadAllData = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await apiFetch('/api/auth/profile');
      if (!profile) return;
      setUser(profile.user);
      const workspaceList = await apiFetch('/api/tenants');
      setTenants(workspaceList || []);
      const tenantId = activeTenantId || profile.user.defaultTenant || workspaceList?.[0]?._id;
      if (tenantId !== activeTenantId) { setActiveTenantId(String(tenantId)); return; }
      const [finance, goal, analytics, notices, ledger] = await Promise.all(['/api/finance/summary', '/api/goals/roadmap', '/api/analytics/forecast', '/api/notifications', '/api/blockchain/ledger'].map(apiFetch));
      setFinanceData(finance); setGoalData(goal); setAnalyticsData(analytics); setNotifications(notices || []); setLedgerRecords(ledger || []);
    } catch (error) { console.error(error); }
  }, [token, apiFetch, activeTenantId]);

  useEffect(() => { loadAllData(); }, [loadAllData]);
  const refresh = () => loadAllData();
  const mutate = async (endpoint, options) => { const result = await apiFetch(endpoint, options); await refresh(); return result; };
  const handleAuthenticated = ({ token: nextToken }) => { localStorage.setItem('authToken', nextToken); setToken(nextToken); };
  const logout = () => { localStorage.removeItem('authToken'); setToken(null); setUser(null); setTenants([]); setActiveTenantId(''); };
  if (!token) return <AuthPage onAuthenticated={handleAuthenticated} />;
  if (!user) return <div className="app-container"><main className="main-content">Loading your account…</main></div>;
  return <div className="app-container"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /><main className="main-content"><Navbar tenants={tenants} activeTenantId={activeTenantId} onSelectTenant={setActiveTenantId} user={user} notifications={notifications} onLogout={logout} />
    {activeTab === 'dashboard' && <Dashboard financeData={financeData} goalData={goalData} analyticsData={analyticsData} notifications={notifications} setActiveTab={setActiveTab} />}
    {activeTab === 'finance' && <FinanceEngine financeData={financeData} onAddIncome={(data) => mutate('/api/finance/income', { method: 'POST', body: JSON.stringify(data) })} onDeleteIncome={(id) => mutate(`/api/finance/income/${id}`, { method: 'DELETE' })} onAddExpense={(data) => mutate('/api/finance/expense', { method: 'POST', body: JSON.stringify(data) })} onDeleteExpense={(id) => mutate(`/api/finance/expense/${id}`, { method: 'DELETE' })} onUpdateBudget={(data) => mutate('/api/finance/budget', { method: 'PUT', body: JSON.stringify(data) })} />}
    {activeTab === 'roadmap' && <GoalRoadmap goalData={goalData} onToggleTask={(roadmapId, taskId) => mutate(`/api/goals/roadmap/${roadmapId}/task/${taskId}`, { method: 'PUT' })} onUpdateGoal={(data) => mutate('/api/goals/goal', { method: 'PUT', body: JSON.stringify(data) })} />}
    {activeTab === 'analytics' && <AnalyticsForecasting analyticsData={analyticsData} />}
    {activeTab === 'blockchain' && <BlockchainLedger ledgerRecords={ledgerRecords} onVerifyHash={(txHash) => apiFetch('/api/blockchain/verify', { method: 'POST', body: JSON.stringify({ txHash }) })} />}
    {activeTab === 'profile' && <PersonalizationProfile user={user} tenants={tenants} onUpdateProfile={(data) => mutate('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) })} onCreateTenant={async (data) => { const result = await mutate('/api/tenants', { method: 'POST', body: JSON.stringify(data) }); setActiveTenantId(String(result._id)); }} />}
  </main></div>;
}
