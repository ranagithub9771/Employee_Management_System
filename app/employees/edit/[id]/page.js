'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import EmployeeForm from '@/components/EmployeeForm';
import { api } from '@/lib/api';

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/employees/${id}`)
      .then(({ employee }) => setEmployee({ ...employee, joiningDate: employee.joiningDate.slice(0, 10) }))
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = async (data) => {
    await api(`/employees/${id}`, { method: 'PUT', body: data });
    router.push('/employees');
  };

  return (
    <AppShell title="Edit Employee">
      {error && <div className="alert alert-error">{error}</div>}
      {!employee && !error && <div className="center-block"><div className="spinner" /></div>}
      {employee && <EmployeeForm initial={employee} onSubmit={submit} submitLabel="Save Changes" />}
    </AppShell>
  );
}
