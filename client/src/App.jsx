import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FinanceEngine from './pages/FinanceEngine';
import GoalRoadmap from './pages/GoalRoadmap';
import AnalyticsForecasting from './pages/AnalyticsForecasting';
import BlockchainLedger from './pages/BlockchainLedger';
import PersonalizationProfile from './pages/PersonalizationProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Alex Rivera', age: 42, medicalConditions: ['chronic_condition_high_cost'] });
  const [tenants, setTenants] = useState([
    { _id: 'tenant_personal_1', name: 'Personal Workspace', type: 'personal' },
    { _id: 'tenant_household_2', name: 'Rivera Household', type: 'household' }
  ]);
  const [activeTenantId, setActiveTenantId] = useState('tenant_personal_1');

  // App Data States
  const [financeData, setFinanceData] = useState(null);
  const [goalData, setGoalData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [ledgerRecords, setLedgerRecords] = useState([]);

  // Resilient multi-port API fetch helper
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-tenant-id': activeTenantId || '',
      ...(options.headers || {})
    };

    const ports = ['', 'http://localhost:5000', 'http://localhost:5001', 'http://localhost:5002'];

    for (const prefix of ports) {
      try {
        const url = `${prefix}${endpoint}`;
        const res = await fetch(url, { ...options, headers });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        // Try next port
      }
    }
    return null;
  };

  const loadAllData = async () => {
    const prof = await apiFetch('/api/auth/profile');
    if (prof && prof.user) {
      setUser(prof.user);
    }

    const tens = await apiFetch('/api/tenants');
    if (tens && tens.length > 0) {
      setTenants(tens);
      if (!activeTenantId) setActiveTenantId(tens[0]._id);
    }

    const fin = await apiFetch('/api/finance/summary');
    if (fin) setFinanceData(fin);

    const goal = await apiFetch('/api/goals/roadmap');
    if (goal) setGoalData(goal);

    const analytics = await apiFetch('/api/analytics/forecast');
    if (analytics) setAnalyticsData(analytics);

    const notifs = await apiFetch('/api/notifications');
    if (notifs) setNotifications(notifs);

    const ledger = await apiFetch('/api/blockchain/ledger');
    if (ledger) setLedgerRecords(ledger);
  };

  useEffect(() => {
    loadAllData();
  }, [activeTenantId]);

  // Handlers
  const handleAddIncome = async (inc) => {
    await apiFetch('/api/finance/income', { method: 'POST', body: JSON.stringify(inc) });
    loadAllData();
  };

  const handleDeleteIncome = async (id) => {
    await apiFetch(`/api/finance/income/${id}`, { method: 'DELETE' });
    loadAllData();
  };

  const handleAddExpense = async (exp) => {
    await apiFetch('/api/finance/expense', { method: 'POST', body: JSON.stringify(exp) });
    loadAllData();
  };

  const handleDeleteExpense = async (id) => {
    await apiFetch(`/api/finance/expense/${id}`, { method: 'DELETE' });
    loadAllData();
  };

  const handleUpdateBudget = async (budget) => {
    const res = await apiFetch('/api/finance/budget', { method: 'PUT', body: JSON.stringify(budget) });
    loadAllData();
    return res;
  };

  const handleUpdateGoal = async (data) => {
    await apiFetch('/api/goals/goal', { method: 'PUT', body: JSON.stringify(data) });
    loadAllData();
  };

  const handleToggleTask = async (roadmapId, taskId) => {
    await apiFetch(`/api/goals/roadmap/${roadmapId}/task/${taskId}`, { method: 'PUT' });
    loadAllData();
  };

  const handleVerifyHash = async (txHash) => {
    return await apiFetch('/api/blockchain/verify', { method: 'POST', body: JSON.stringify({ txHash }) });
  };

  const handleUpdateProfile = async (data) => {
    const res = await apiFetch('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
    if (res) setUser(res);
    loadAllData();
  };

  const handleCreateTenant = async (data) => {
    const newT = await apiFetch('/api/tenants', { method: 'POST', body: JSON.stringify(data) });
    if (newT) {
      setTenants([...tenants, newT]);
      setActiveTenantId(newT._id);
    }
    loadAllData();
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Navbar
          tenants={tenants}
          activeTenantId={activeTenantId}
          onSelectTenant={(id) => setActiveTenantId(id)}
          user={user}
          notifications={notifications?.notifications}
        />

        {activeTab === 'dashboard' && (
          <Dashboard
            financeData={financeData}
            goalData={goalData}
            analyticsData={analyticsData}
            notifications={notifications}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceEngine
            financeData={financeData}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {activeTab === 'roadmap' && (
          <GoalRoadmap
            goalData={goalData}
            onToggleTask={handleToggleTask}
            onUpdateGoal={handleUpdateGoal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsForecasting analyticsData={analyticsData} />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainLedger
            ledgerRecords={ledgerRecords}
            onVerifyHash={handleVerifyHash}
          />
        )}

        {activeTab === 'profile' && (
          <PersonalizationProfile
            user={user}
            tenants={tenants}
            onUpdateProfile={handleUpdateProfile}
            onCreateTenant={handleCreateTenant}
          />
        )}
      </main>
    </div>
  );
}
