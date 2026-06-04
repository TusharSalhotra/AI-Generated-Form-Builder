'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';

export function Navbar() {
  const [session, setSession] = useState<{ email?: string } | null>(null);
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialTheme = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
    queueMicrotask(() => setTheme(initialTheme));

    // fetch session
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j) => {
        if (j?.user) setSession(j.user);
      })
      .catch(() => setSession(null));
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const navItems = [
    { href: '/builder', label: 'Builder' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/form', label: 'Forms' },
    { href: '/analytics', label: 'Analytics' },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const activeMenuClass =
    'border border-cyan-200 bg-cyan-50 text-cyan-800 shadow-sm dark:border-cyan-400/30 dark:bg-cyan-400 dark:text-slate-950';
  const idleMenuClass =
    'border border-transparent text-slate-700 hover:border-slate-200 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 dark:hover:text-white';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/70 dark:shadow-black/25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 shadow-lg shadow-cyan-600/30">
              <span className="text-white font-bold text-sm">✨</span>
            </div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              SmartForm AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                  isActive(item.href) ? activeMenuClass : idleMenuClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200/80 bg-white/70 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Auth / Theme Toggle */}
            {session ? (
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  setSession(null);
                  window.location.href = '/';
                }}
                className="hidden rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 md:inline-flex"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 md:inline-flex"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-slate-200/80 bg-white/70 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/70 bg-slate-50/95 py-1 dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mx-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive(item.href)
                      ? activeMenuClass
                      : 'border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-200 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
