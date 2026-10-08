'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const set = (k) => (e) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    const errs = {};
    if (isRegister && v.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errs.email = 'Enter a valid email';
    if (v.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (isRegister && v.confirm !== v.password) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      if (isRegister) await register(v.name.trim(), v.email.trim(), v.password);
      else await login(v.email.trim(), v.password);
      router.replace('/dashboard');
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  const input = (k, label, type = 'text') => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <input id={k} type={type} value={v[k]} onChange={set(k)} className={errors[k] ? 'invalid' : ''} />
      {errors[k] && <span className="error-text">{errors[k]}</span>}
    </div>
  );

  return (
    <div className="center-screen">
      <form onSubmit={submit} className="card auth-card" noValidate>
        <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p className="muted">{isRegister ? 'Register to manage your employees.' : 'Login to continue.'}</p>
        {formError && <div className="alert alert-error">{formError}</div>}
        {isRegister && input('name', 'Name')}
        {input('email', 'Email', 'email')}
        {input('password', 'Password', 'password')}
        {isRegister && input('confirm', 'Confirm password', 'password')}
        <button className="btn btn-block" disabled={submitting}>
          {submitting ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
        <p className="muted center">
          {isRegister ? (<>Already have an account? <Link href="/login">Login</Link></>) : (<>No account? <Link href="/register">Register</Link></>)}
        </p>
      </form>
    </div>
  );
}
