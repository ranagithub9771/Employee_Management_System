'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { api } from '@/lib/api';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api(`/employees/${id}`).then((d) => setEmp(d.employee)).catch((e) => setError(e.message));
  }, [id]);

  const remove = async () => {
    if (!window.confirm(`Delete ${emp.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api(`/employees/${id}`, { method: 'DELETE' });
      router.push('/employees');
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  };

  const rows = emp && [
    ['Name', emp.name],
    ['Email', emp.email],
    ['Phone', emp.phone],
    ['Department', emp.department],
    ['Designation', emp.designation],
    ['Salary', `₹ ${Number(emp.salary).toLocaleString('en-IN')}`],
    ['Joining Date', new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Status', <span key="s" className={`badge badge-${emp.status.toLowerCase()}`}>{emp.status}</span>],
  ];

  return (
    <AppShell
      title="Employee Details"
      actions={emp && (
        <>
          <Link href="/employees" className="btn btn-outline">Back</Link>{' '}
          <Link href={`/employees/edit/${id}`} className="btn">Edit</Link>{' '}
          <button className="btn btn-danger" onClick={remove} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        </>
      )}
    >
      {error && <div className="alert alert-error">{error}</div>}
      {!emp && !error && <div className="center-block"><div className="spinner" /></div>}
      {rows && (
        <div className="card details">
          {rows.map(([k, v]) => (
            <div key={k} className="detail-row"><span className="muted">{k}</span><span>{v}</span></div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
