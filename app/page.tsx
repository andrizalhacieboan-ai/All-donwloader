import UrlInput from '@/components/UrlInput';
import { ThemeToggle } from '@/components/ThemeToggle';
import { History } from '@/components/History'; // Buat komponen ini opsional
import { Sparkles, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-purple-500/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Ndri All Downloader
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Glow Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-0"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Download Video & Audio<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tanpa Watermark
            </span>
          </h2>
          <p className="text-purple-200/70 md:text-lg mb-12 max-w-2xl mx-auto">
            Dukungan YouTube, TikTok, Instagram, Facebook, Pinterest, dan Threads. Cepat, Gratis, Semua Format.
          </p>

          <UrlInput />
          
          <History />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 py-8 bg-slate-950/50">
        <div className="container mx-auto px-4 text-center text-sm text-purple-200/60">
          <p className="mb-2">© {new Date().getFullYear()} Ndri All Downloader. All rights reserved.</p>
          <p className="text-xs max-w-2xl mx-auto">
            Disclaimer: Website ini hanya untuk download konten dari provider tanpa merugikan developer/CEO. Hormati Hak Cipta. Kami tidak menyimpan file apapun di server kami.
          </p>
        </div>
      </footer>
    </div>
  );
}
