// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
).replace(/\/+$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Please try again.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Expired/invalid token on a protected call -> force re-login
    if (res.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const err = new Error(data.message || 'Something went wrong');
    err.fieldErrors = data.errors || {};
    throw err;
  }
  return data;
}
