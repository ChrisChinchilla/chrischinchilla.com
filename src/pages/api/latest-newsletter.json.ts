import { getCollection } from 'astro:content';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_BUCKET = import.meta.env.PUBLIC_SUPABASE_IMAGES_BUCKET || 'images';
const RAINDROP_TOKEN = import.meta.env.RAINDROP;

function resolveImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${cleanPath}`;
}

export async function GET() {
  const newsletters = await getCollection('newsletters');
  const sorted = newsletters.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  const latest = sorted[0];

  if (!latest) {
    return new Response(JSON.stringify({ error: 'No newsletters found' }), { status: 404 });
  }

  // Fetch Raindrop links for this newsletter
  let links: any[] = [];
  if (RAINDROP_TOKEN) {
    try {
      const response = await fetch(
        `https://api.raindrop.io/rest/v1/raindrops/45559645?sort=-created&search=${latest.id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${RAINDROP_TOKEN}` },
        }
      );
      const data = await response.json();
      links = Object.values(data.items)
        .filter((item: any) => {
          const createdDate = new Date(item.created);
          return createdDate <= latest.data.date;
        })
        .map((item: any) => ({
          title: item.title,
          link: item.link,
          domain: item.domain,
          note: item.note,
          cover: item.cover,
        }));
    } catch (e) {
      console.error('Failed to fetch Raindrop links:', e);
    }
  }

  const payload = {
    id: latest.id,
    title: latest.data.title,
    date: latest.data.date.toISOString(),
    summary: latest.data.summary || '',
    image: resolveImageUrl(latest.data.image as string),
    canonicalUrl: `https://chrischinchilla.com/newsletter/${latest.id}`,
    body: latest.body,
    links,
  };

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}
