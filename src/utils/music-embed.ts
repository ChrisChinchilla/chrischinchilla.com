// Picks the first available player for a release: Bandcamp, then SoundCloud, then Spotify.
export interface MusicEmbed {
  src: string;
  height: number;
}

const find = (urls: string[], host: string) => urls.find((u) => new URL(u, 'https://x').hostname.endsWith(host));
const cache = new Map<string, Promise<MusicEmbed | undefined>>();

async function resolve(urls: string[]): Promise<MusicEmbed | undefined> {
  const bandcamp = find(urls, 'bandcamp.com');
  if (bandcamp) {
    // Bandcamp embeds need a numeric id that only appears in the page's og:video tag.
    try {
      const html = await (await fetch(bandcamp)).text();
      const m = html.match(/EmbeddedPlayer\/(?:v=2\/)?(album|track)=(\d+)/);
      if (m) {
        return {
          src: `https://bandcamp.com/EmbeddedPlayer/${m[1]}=${m[2]}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/transparent=true/`,
          height: m[1] === 'album' ? 720 : 472,
        };
      }
    } catch {
      // shortcut: network failure drops to the next provider, no retry
    }
  }
  const soundcloud = find(urls, 'soundcloud.com');
  if (soundcloud) {
    return { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloud)}&visual=true`, height: 400 };
  }
  const spotify = find(urls, 'open.spotify.com');
  if (spotify) return { src: spotify.replace('open.spotify.com/', 'open.spotify.com/embed/'), height: 352 };
}

// Memoized so the page (JSON-LD) and the player component share one Bandcamp fetch.
export const getMusicEmbed = (urls: string[]) => {
  const key = urls.join('|');
  if (!cache.has(key)) cache.set(key, resolve(urls));
  return cache.get(key)!;
};
