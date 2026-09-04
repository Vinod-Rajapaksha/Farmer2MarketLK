import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Toaster from '../common/Toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <Toaster />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {/* Footer can be added here later */}
    </div>
  );
}
