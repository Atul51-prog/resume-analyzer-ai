import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 ${className}`}>
      {children}
    </main>
  );
}
