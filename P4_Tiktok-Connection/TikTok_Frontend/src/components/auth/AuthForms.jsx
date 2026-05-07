'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import toast from 'react-hot-toast';

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      <p className="text-center text-sm">
        No account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-red-500 hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
}

export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.name);
      toast.success('Account created!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['name', 'username', 'email', 'password'].map(field => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
          <input
            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            name={field} value={form[field]} onChange={handleChange}
            required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      ))}
      <button
        type="submit" disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
      <p className="text-center text-sm">
        Have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-red-500 hover:underline">
          Log in
        </button>
      </p>
    </form>
  );
}