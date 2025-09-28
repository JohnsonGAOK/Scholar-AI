'use client';

import { useState, useEffect } from 'react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: string, id: string) => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="w-full p-4 border-b focus:outline-none"
          autoFocus
        />
        <div className="p-4">
          <p className="text-gray-500">搜索结果将显示在这里。</p>
        </div>
        <div className="p-2 border-t text-right">
          <button onClick={onClose} className="text-sm text-gray-500">ESC 关闭</button>
        </div>
      </div>
    </div>
  );
}
