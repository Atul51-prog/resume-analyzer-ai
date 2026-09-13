'use client';

import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreCircleProps {
  score: number;
  label?: string;
}

export default function ScoreCircle({ score, label = 'ATS Score' }: ScoreCircleProps) {
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 60) return '#eab308'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="w-48 h-48 sm:w-56 sm:h-56 relative drop-shadow-2xl">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: getColor(score),
            textColor: '#ffffff',
            trailColor: '#27272a',
            textSize: '22px',
            pathTransitionDuration: 0.8,
          })}
        />
      </div>
      <h3 className="text-xl font-bold mt-6 text-zinc-200">{label}</h3>
      <p className="text-sm text-zinc-400 mt-1">
        {score >= 80
          ? '🌟 Excellent - Highly optimized for target screening'
          : score >= 60
          ? '⚡ Good - Moderate optimization, check suggestions'
          : '⚠️ Needs Improvement - Missing key ATS requirements'}
      </p>
    </div>
  );
}
