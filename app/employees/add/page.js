'use client';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import EmployeeForm from '@/components/EmployeeForm';
import { api } from '@/lib/api';

export default function AddEmployeePage() {
  const router = useRouter();
  const submit = async (data) => {
    await api('/employees', { method: 'POST', body: data });
    router.push('/employees');
  };
  return (
    <AppShell title="Add Employee">
      <EmployeeForm onSubmit={submit} submitLabel="Add Employee" />
    </AppShell>
  );
}
