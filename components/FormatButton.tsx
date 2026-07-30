import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FormatButton({ quality, type, url }: { quality: string; type: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" download>
      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20">
        <Download className="mr-2 h-4 w-4" />
        {type === 'audio' ? 'MP3' : 'MP4'} {quality}
      </Button>
    </a>
  );
}
