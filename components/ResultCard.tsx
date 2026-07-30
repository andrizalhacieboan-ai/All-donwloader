import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
      <Card className="w-full max-w-3xl mt-8 bg-white/5 backdrop-blur border-purple-500/20">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 bg-purple-500/20" />
          <Skeleton className="h-4 w-1/4 mt-2 bg-purple-500/20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-xl bg-purple-500/20" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <Skeleton className="h-10 bg-purple-500/20" />
            <Skeleton className="h-10 bg-purple-500/20" />
            <Skeleton className="h-10 bg-purple-500/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="w-full max-w-3xl mt-8 bg-white/5 backdrop-blur border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-2xl">
      <CardHeader>
        <h2 className="text-xl font-bold text-white line-clamp-2">{data.title}</h2>
        <p className="text-sm text-purple-300 capitalize">{data.platform} • {data.author}</p>
      </CardHeader>
      <CardContent>
        {data.thumbnail && (
          <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden mb-6 border border-purple-500/20">
            <Image src={data.thumbnail} alt={data.title} fill className="object-cover" unoptimized />
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.formats.map((fmt, idx) => (
            <FormatButton key={idx} quality={fmt.quality} type={fmt.type} url={fmt.url} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
