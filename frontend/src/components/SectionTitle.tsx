import React from 'react';

export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
      {children}
    </h2>
  );
}
