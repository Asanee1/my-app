// src/components/ui/progress.jsx
import React from 'react';

export const Progress = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className="bg-purple-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
        style={{ width: `${value}%` }}
      >
        {value}%
      </div>
    </div>
  );
};
