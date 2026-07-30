import { Skeleton } from '@/components/ui/skeleton'; // Buat skeleton manual jika tidak pakai shadcn
import FormatButton from './FormatButton';
import Image from 'next/image';

interface ResultData {
  title: string;
  thumbnail: string;
  author: string;
  platform: string;
  formats: { quality: string; type: string; url: string }[];
}

export default function ResultCard({ data, loading }: { data: ResultData | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="w-full max-w-3xl mt-12 p-8 rounded-2xl bg-neu-bg shadow-neu-out">
        <div className="h-6 w-3/4 bg-neu-light rounded mb-4 animate-pulse"></div>
        <div className="h-4 w-1/4 bg-neu-light rounded mb-8 animate-pulse"></div>
        <div className="h-[250px] w-full rounded-xl bg-neu-light animate-pulse mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-12 bg-neu-light rounded-xl animate-pulse"></div>
          <div className="h-12 bg-neu-light rounded-xl animate-pulse"></div>
          <div className="h-12 bg-neu-light rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-3xl mt-12 p-8 rounded-2xl bg-neu-bg shadow-neu-out">
      <h2 className="text-xl font-bold text-white line-clamp-2 mb-1">{data.title}</h2>
      <p className="text-sm text-gray-400 capitalize mb-6">Platform: {data.platform} • Author: {data.author}</p>
      
      {data.thumbnail && (
        <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden mb-8 shadow-neu-in">
          <Image src={data.thumbnail} alt={data.title} fill className="object-cover" unoptimized />
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.formats.map((fmt, idx) => (
          <FormatButton key={idx} quality={fmt.quality} type={fmt.type} url={fmt.url} />
        ))}
      </div>
    </div>
  );
}
