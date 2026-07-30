'use client';
import { useHistoryStore } from '@/lib/store';
import { Clock } from 'lucide-react';

export function History() {
  const history = useHistoryStore((state) => state.history);
  if (history.length === 0) return null;

  return (
    <div className="mt-16 w-full max-w-3xl">
      <h3 className="flex items-center gap-2 text-purple-300 font-semibold mb-4 justify-center md:justify-start">
        <Clock className="h-4 w-4" /> Riwayat Unduhan
      </h3>
      <div className="space-y-2">
        {history.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-purple-500/10 flex justify-between items-center text-sm">
            <span className="truncate text-white/80 max-w-[70%]">{item.title}</span>
            <span className="text-purple-400 capitalize text-xs">{item.platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
