import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let baseStyle = 'px-5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed ';

  if (variant === 'primary') {
    baseStyle += 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow active:scale-[0.99] ';
  } else if (variant === 'secondary') {
    baseStyle += 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 ';
  } else if (variant === 'danger') {
    baseStyle += 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 ';
  } else if (variant === 'outline') {
    baseStyle += 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent ';
  }

  return (
    <button className={`${baseStyle} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
