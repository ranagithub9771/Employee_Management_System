'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/employees/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  const cards = stats && [
    { label: 'Total Employees', value: stats.total, tone: 'blue' },
    { label: 'Active Employees', value: stats.active, tone: 'green' },
    { label: 'Inactive Employees', value: stats.inactive, tone: 'red' },
    { label: 'Total Departments', value: stats.totalDepartments, tone: 'purple' },
  ];

  return (
    <AppShell title="Dashboard" actions={<Link href="/employees/add" className="btn">+ Add Employee</Link>}>
      {error && <div className="alert alert-error">{error}</div>}
      {!stats && !error && <div className="center-block"><div className="spinner" /></div>}
      {cards && (
        <div className="stats-grid">
          {cards.map((c) => (
            <div key={c.label} className={`card stat stat-${c.tone}`}>
              <span className="muted">{c.label}</span>
              <strong>{c.value}</strong>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
