'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { api } from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ page, limit: 10 });
      if (debounced) qs.set('search', debounced);
      if (department) qs.set('department', department);
      if (status) qs.set('status', status);
      const data = await api(`/employees?${qs}`);
      setEmployees(data.employees);
      setPages(data.pages);
      setTotal(data.total);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, debounced, department, status]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api('/employees/stats').then((s) => setDepartments(s.departments)).catch(() => {});
  }, []);

  const remove = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}? This cannot be undone.`)) return;
    setDeletingId(emp._id);
    try {
      await api(`/employees/${emp._id}`, { method: 'DELETE' });
      if (employees.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell title="Employees" actions={<Link href="/employees/add" className="btn">+ Add Employee</Link>}>
      <div className="card filters">
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <div className="center-block"><div className="spinner" /></div>
        ) : employees.length === 0 ? (
          <p className="empty">No employees found.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e._id}>
                  <td><Link href={`/employees/${e._id}`}>{e.name}</Link></td>
                  <td>{e.email}</td>
                  <td>{e.department}</td>
                  <td>{e.designation}</td>
                  <td><span className={`badge badge-${e.status.toLowerCase()}`}>{e.status}</span></td>
                  <td className="row-actions">
                    <Link href={`/employees/${e._id}`} className="btn btn-sm btn-outline">View</Link>
                    <Link href={`/employees/edit/${e._id}`} className="btn btn-sm btn-outline">Edit</Link>
                    <button className="btn btn-sm btn-danger" disabled={deletingId === e._id} onClick={() => remove(e)}>
                      {deletingId === e._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="pagination">
          <button className="btn btn-sm btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span className="muted">Page {page} of {pages} · {total} employees</span>
          <button className="btn btn-sm btn-outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </AppShell>
  );
}
