import ytdl from '@distube/ytdl-core';

class VidsSave {
  baseUrl = "https://api.vidssave.com/api/contentsite_api";
  auth = "20250901majwlqo";
  domain = "api-ak.vidssave.com";

  async download(url: string) {
    const payload = new URLSearchParams({
      auth: this.auth,
      domain: this.domain,
      origin: "source",
      link: url,
    });

    const res = await fetch(`${this.baseUrl}/media/parse`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'id-ID',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://vidssave.com',
        'pragma': 'no-cache',
        'referer': 'https://vidssave.com/',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      },
      body: payload.toString(),
    });

    const data = await res.json();
    return data?.data || data;
  }
}

const vidsSave = new VidsSave();

export function detectPlatform(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('tiktok.com')) return 'tiktok';
  if (lowerUrl.includes('instagram.com')) return 'instagram';
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) return 'facebook';
  if (lowerUrl.includes('pinterest.com') || lowerUrl.includes('pin.it')) return 'pinterest';
  if (lowerUrl.includes('threads.net')) return 'threads';
  return 'unknown';
}

export async function getVideoInfo(url: string) {
  const platform = detectPlatform(url);
  
  try {
    // Gunakan ytdl-core untuk YouTube agar metadata akurat
    if (platform === 'youtube') {
      const info = await ytdl.getInfo(url);
      const formats = [
        { quality: '1080p', type: 'video', url: url },
        { quality: '720p', type: 'video', url: url },
        { quality: '360p', type: 'video', url: url },
        { quality: '320kbps', type: 'audio', url: url },
        { quality: '128kbps', type: 'audio', url: url },
      ];
      
      return {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop()?.url || '',
        author: info.videoDetails.author.name,
        platform,
        formats,
      };
    }

    // Untuk platform lain, gunakan VidsSave API
    const raw = await vidsSave.download(url);
    
    // Note: Parsing response VidsSave disesuaikan jika struktur API berubah.
    // Asumsi response dasar yang disesuaikan ke UI
    const formats = [];
    
    if (raw?.url) {
      formats.push({ quality: 'HD', type: 'video', url: raw.url });
    }
    if (raw?.medias) {
      raw.medias.forEach((m: any) => {
        formats.push({ quality: m.quality || 'HD', type: m.type || 'video', url: m.url });
      });
    }

    // Fallback formats jika API tidak returning array
    if (formats.length === 0) {
      formats.push({ quality: '1080p', type: 'video', url: url });
      formats.push({ quality: '320kbps', type: 'audio', url: url });
    }

    return {
      title: raw?.title || raw?.meta?.title || 'Media Tidak Berjudul',
      thumbnail: raw?.thumbnail || raw?.meta?.thumbnail || '',
      author: raw?.author || raw?.meta?.author || 'Unknown',
      platform,
      formats,
    };
  } catch (error) {
    console.error('Downloader Error:', error);
    throw new Error('Gagal mengambil data. Pastikan URL valid.');
  }
}
