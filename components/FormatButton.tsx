import { Download } from 'lucide-react';

export default function FormatButton({ quality, type, url }: { quality: string; type: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" download className="block w-full">
      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neu-bg shadow-neu-sm hover:shadow-neu-in transition-all duration-300 text-white hover:text-neu-orange font-medium">
        <Download className="h-4 w-4" />
        {type === 'audio' ? 'MP3' : 'MP4'} {quality}
      </button>
    </a>
  );
}
