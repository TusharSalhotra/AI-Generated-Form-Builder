import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'SmartForm AI - Self-Learning Form Builder',
  description:
    'AI-powered self-learning form builder. Create intelligent, dynamic forms with drag-and-drop simplicity.',
  keywords: [
    'form builder',
    'AI forms',
    'smart forms',
    'dynamic forms',
    'drag and drop',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-slate-900 dark:text-slate-50 antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <Providers>
            <main className="flex-1">{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
