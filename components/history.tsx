'use client';
import { useHistoryStore } from '@/lib/store';
import { Clock } from 'lucide-react';

export function History() {
  const history = useHistoryStore((state) => state.history);
  if (history.length === 0) return null;

  return (
    <div className="mt-16 w-full max-w-3xl p-6 rounded-2xl bg-neu-bg shadow-neu-out">
      <h3 className="flex items-center gap-2 text-neu-orange font-semibold mb-4">
        <Clock className="h-5 w-5" /> Riwayat Unduhan
      </h3>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
        {history.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-neu-bg shadow-neu-in flex justify-between items-center text-sm">
            <span className="truncate text-white/80 max-w-[70%]">{item.title}</span>
            <span className="text-neu-orange capitalize text-xs font-medium">{item.platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
