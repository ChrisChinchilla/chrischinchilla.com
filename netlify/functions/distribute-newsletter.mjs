/**
 * Netlify deploy-succeeded function
 *
 * Sends the latest newsletter data to a Make (Integromat) webhook,
 * which handles creating drafts on Substack and LinkedIn.
 * Medium is handled manually via https://medium.com/p/import
 *
 * Required environment variables (set in Netlify UI):
 *   MAKE_WEBHOOK_URL    - Your Make scenario webhook URL
 *   NEWSLETTER_SITE_URL - Defaults to https://chrischinchilla.com
 */

import { getStore } from '@netlify/blobs';

const SITE_URL = process.env.NEWSLETTER_SITE_URL || 'https://chrischinchilla.com';

function buildMarkdownContent(newsletter) {
  let content = '';

  if (newsletter.body) {
    content += newsletter.body.trim();
  }

  if (newsletter.links && newsletter.links.length > 0) {
    content += '\n\n---\n\n## Curated links\n\n';
    for (const link of newsletter.links) {
      content += `### [${link.title}](${link.link})\n`;
      if (link.domain) {
        content += `*${link.domain}*\n\n`;
      }
      if (link.note) {
        content += `${link.note}\n\n`;
      }
    }
  }

  content += `\n\n---\n\n*Originally published at [chrischinchilla.com](${newsletter.canonicalUrl})*\n`;

  return content;
}

function buildHtmlContent(newsletter) {
  let html = '';

  if (newsletter.body) {
    html += newsletter.body
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  if (newsletter.links && newsletter.links.length > 0) {
    html += '<hr><h2>Curated links</h2>';
    for (const link of newsletter.links) {
      html += `<h3><a href="${link.link}">${link.title}</a></h3>`;
      if (link.domain) html += `<p><em>${link.domain}</em></p>`;
      if (link.note) html += `<p>${link.note}</p>`;
      if (link.cover) html += `<img src="${link.cover}" alt="${link.title}" />`;
    }
  }

  html += `<hr><p><em>Originally published at <a href="${newsletter.canonicalUrl}">chrischinchilla.com</a></em></p>`;

  return html;
}

export default async (req) => {
  console.log('Newsletter distribution triggered');

  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('MAKE_WEBHOOK_URL not set');
    return new Response(JSON.stringify({ error: 'MAKE_WEBHOOK_URL not configured' }), {
      status: 500,
    });
  }

  // Fetch latest newsletter data from the live site
  const apiUrl = `${SITE_URL}/api/latest-newsletter.json`;
  let newsletter;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error('Failed to fetch newsletter data:', res.status);
      return new Response(JSON.stringify({ error: 'Failed to fetch newsletter data' }), {
        status: 500,
      });
    }
    newsletter = await res.json();
  } catch (e) {
    console.error('Error fetching newsletter:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }

  // Check if we already distributed this newsletter
  const store = getStore('newsletter-distribution');
  const lastDistributedId = await store.get('last-distributed-id');

  if (lastDistributedId === newsletter.id) {
    console.log(`Newsletter ${newsletter.id} already distributed, skipping`);
    return new Response(
      JSON.stringify({ message: 'Already distributed', id: newsletter.id }),
      { status: 200 }
    );
  }

  console.log(`Distributing newsletter: ${newsletter.id} — "${newsletter.title}"`);

  // Send to Make webhook with all content formats pre-built
  const payload = {
    id: newsletter.id,
    title: newsletter.title,
    date: newsletter.date,
    summary: newsletter.summary,
    image: newsletter.image,
    canonicalUrl: newsletter.canonicalUrl,
    markdown: buildMarkdownContent(newsletter),
    html: buildHtmlContent(newsletter),
    links: newsletter.links,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Make webhook error:', res.status, body);
      return new Response(JSON.stringify({ error: 'Webhook failed', status: res.status }), {
        status: 500,
      });
    }

    // Store the distributed newsletter ID
    await store.set('last-distributed-id', newsletter.id);

    console.log(`Newsletter ${newsletter.id} sent to Make successfully`);
    return new Response(
      JSON.stringify({ success: true, newsletter: newsletter.id, title: newsletter.title }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Error sending to Make:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const config = {
  type: 'deploy-succeeded',
};
