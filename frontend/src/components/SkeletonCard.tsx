import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-zinc-800 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
    </div>
  );
}
