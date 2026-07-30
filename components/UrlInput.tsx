'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Youtube, Instagram, Facebook, Music2, Image as ImageIcon, MessageCircle } from 'lucide-react';
import ResultCard from './ResultCard';
import { useHistoryStore } from '@/lib/store';

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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <Input
          type="url"
          placeholder="Paste URL di sini"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 h-14 text-base bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus-visible:ring-purple-500 rounded-xl"
          required
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="h-14 px-8 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 rounded-xl"
        >
          <Download className="mr-2 h-5 w-5" />
          Download
        </Button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      <div className="flex flex-wrap justify-center items-center gap-6 mt-10 opacity-80">
        <div className="flex flex-col items-center gap-1 text-purple-300"><Youtube className="h-8 w-8" /><span className="text-xs">YouTube</span></div>
        <div className="flex flex-col items-center gap-1 text-purple-300"><Music2 className="h-8 w-8" /><span className="text-xs">TikTok</span></div>
        <div className="flex flex-col items-center gap-1 text-purple-300"><Instagram className="h-8 w-8" /><span className="text-xs">Instagram</span></div>
        <div className="flex flex-col items-center gap-1 text-purple-300"><Facebook className="h-8 w-8" /><span className="text-xs">Facebook</span></div>
        <div className="flex flex-col items-center gap-1 text-purple-300"><ImageIcon className="h-8 w-8" /><span className="text-xs">Pinterest</span></div>
        <div className="flex flex-col items-center gap-1 text-purple-300"><MessageCircle className="h-8 w-8" /><span className="text-xs">Threads</span></div>
      </div>

      <ResultCard data={result} loading={loading} />
    </div>
  );
}
