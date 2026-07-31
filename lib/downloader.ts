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

// Kasih label kualitas yang enak dibaca dari data mentah ytdl
function formatVideoLabel(qualityLabel: string | null | undefined, itag: number) {
  return qualityLabel || `itag-${itag}`;
}

export async function getVideoInfo(url: string) {
  const platform = detectPlatform(url);

  try {
    // YouTube pakai ytdl-core soalnya datanya paling lengkap dan link-nya beneran valid
    if (platform === 'youtube') {
      const info = await ytdl.getInfo(url);

      // Format progresif (video+audio jadi satu file) - ini yang bisa langsung didownload
      // tanpa perlu digabung (merge) pakai ffmpeg
      const progressive = ytdl
        .filterFormats(info.formats, 'videoandaudio')
        .filter((f) => f.container === 'mp4')
        .sort((a, b) => (b.height || 0) - (a.height || 0));

      // Format audio only, diurutin dari bitrate paling gede
      const audioOnly = ytdl
        .filterFormats(info.formats, 'audioonly')
        .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

      const formats: { quality: string; type: string; url: string }[] = [];
      const seenVideoQuality = new Set<string>();

      for (const f of progressive) {
        const label = formatVideoLabel(f.qualityLabel, f.itag);
        if (seenVideoQuality.has(label)) continue; // skip duplikat kualitas yang sama
        seenVideoQuality.add(label);
        formats.push({ quality: label, type: 'video', url: f.url });
        if (formats.length >= 3) break; // cukup 3 pilihan video biar UI-nya nggak penuh
      }

      const seenAudioQuality = new Set<string>();
      for (const f of audioOnly) {
        const label = f.audioBitrate ? `${f.audioBitrate}kbps` : 'Audio';
        if (seenAudioQuality.has(label)) continue;
        seenAudioQuality.add(label);
        formats.push({ quality: label, type: 'audio', url: f.url });
        if (seenAudioQuality.size >= 2) break; // 2 pilihan audio udah cukup
      }

      // Kalau ternyata ytdl nggak nemu format progresif sama sekali (jarang, tapi bisa terjadi)
      if (formats.length === 0) {
        throw new Error('Nggak ada format yang bisa didownload langsung dari video ini.');
      }

      return {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop()?.url || '',
        author: info.videoDetails.author.name,
        platform,
        formats,
      };
    }

    // Selain YouTube, pakai API VidsSave
    const raw = await vidsSave.download(url);

    const formats: { quality: string; type: string; url: string }[] = [];

    if (raw?.url) {
      formats.push({ quality: 'HD', type: 'video', url: raw.url });
    }
    if (Array.isArray(raw?.medias)) {
      raw.medias.forEach((m: any) => {
        if (!m?.url) return; // skip kalau nggak ada link filenya, daripada tombolnya nyasar
        formats.push({ quality: m.quality || 'HD', type: m.type || 'video', url: m.url });
      });
    }

    // Kalau API-nya nggak balikin link valid sama sekali, jangan dipaksain kasih hasil palsu.
    // Mending kasih tau usernya gagal daripada dia mikir udah dapet link padahal itu cuma URL asli lagi.
    if (formats.length === 0) {
      throw new Error('API sumbernya lagi nggak ngembaliin link file. Coba link lain atau coba lagi beberapa saat.');
    }

    return {
      title: raw?.title || raw?.meta?.title || 'Judul nggak ketemu',
      thumbnail: raw?.thumbnail || raw?.meta?.thumbnail || '',
      author: raw?.author || raw?.meta?.author || 'Nggak diketahui',
      platform,
      formats,
    };
  } catch (error) {
    console.error('Downloader Error:', error);
    const message = error instanceof Error ? error.message : 'Gagal ambil data dari URL itu.';
    throw new Error(message || 'Coba cek lagi URL-nya, kayaknya ada yang salah.');
  }
}
