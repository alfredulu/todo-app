import React, { useEffect, useState } from 'react';

export function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm px-4 py-3 rounded-lg border ${bgColor} animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      {message}
    </div>
  );
}
