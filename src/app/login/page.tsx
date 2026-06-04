'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      await router.replace('/builder');
    } else {
      setError(json.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300/90 bg-white/90 px-3.5 py-2.5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300/90 bg-white/90 px-3.5 py-2.5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" className="w-full" isLoading={loading} disabled={loading}>
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Don't have an account? <a href="/signup" className="font-medium text-sky-600 dark:text-sky-400">Sign up</a>
        </div>
      </div>
    </div>
  );
}
