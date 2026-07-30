'use client';
import { useState } from 'react';
import ResultCard from './ResultCard';
import { useHistoryStore } from '@/lib/store';
import { Youtube, Instagram, Facebook, Music2, Image as ImageIcon, MessageCircle, Download, Link2 } from 'lucide-react';

export default function UrlInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Gagal memproses');
      
      setResult(data);
      addHistory({
        url,
        title: data.title,
        platform: data.platform,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-neu-orange h-5 w-5" />
          <input
            type="url"
            placeholder="Tempel URL di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-16 pl-14 pr-4 text-base text-white bg-neu-bg rounded-2xl shadow-neu-in outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-neu-orange"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="h-16 px-8 flex items-center justify-center gap-2 text-base font-bold bg-neu-orange text-white rounded-2xl shadow-neu-orange hover:bg-orange-600 transition-all disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          {loading ? 'Loading...' : 'Download'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-6 text-center">{error}</p>}

      {/* Platform Logos with Brand Colors */}
      <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <Youtube className="h-8 w-8 text-red-600" />
          <span className="text-xs text-gray-300">YouTube</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <Music2 className="h-8 w-8 text-cyan-400" />
          <span className="text-xs text-gray-300">TikTok</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <Instagram className="h-8 w-8 text-pink-500" />
          <span className="text-xs text-gray-300">Instagram</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <Facebook className="h-8 w-8 text-blue-600" />
          <span className="text-xs text-gray-300">Facebook</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <ImageIcon className="h-8 w-8 text-red-500" />
          <span className="text-xs text-gray-300">Pinterest</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neu-bg shadow-neu-sm">
          <MessageCircle className="h-8 w-8 text-white" />
          <span className="text-xs text-gray-300">Threads</span>
        </div>
      </div>

      <ResultCard data={result} loading={loading} />
    </div>
  );
}
