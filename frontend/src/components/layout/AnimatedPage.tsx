import type { ReactNode } from 'react';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  return (
    <div className={`w-full flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}>
      {children}
    </div>
  );
}
