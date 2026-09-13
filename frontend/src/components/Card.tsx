import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-sm transition-all hover:border-slate-700/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
