// What to do when a build-time feed (YouTube playlist, podcast RSS) can't be read.
//
// A silently empty feed would publish a site with no episode or video pages and no
// video redirects, so a production build fails instead and Netlify keeps the last good
// deploy. Dev, and builds with ALLOW_EMPTY_FEEDS=1 (e.g. offline), warn and carry on.
export const handleFeedFailure = (what: string, reason: unknown): void => {
  const message = `Unable to fetch ${what} during build: ${reason instanceof Error ? reason.message : String(reason)}`;
  if (import.meta.env.PROD && !import.meta.env.ALLOW_EMPTY_FEEDS && !process.env.ALLOW_EMPTY_FEEDS) {
    throw new Error(`${message}. Set ALLOW_EMPTY_FEEDS=1 to build without it.`);
  }
  console.warn(message);
};
