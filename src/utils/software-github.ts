import snapshot from '../data/software-github.json';

type Stats = { stars: number; forks: number; checked: string };
const cache = new Map<string, Promise<Stats | undefined>>();

export function getSoftwareStats(repo: string): Promise<Stats | undefined> {
  if (!cache.has(repo)) {
    cache.set(repo, fetchStats(repo));
  }
  return cache.get(repo)!;
}

async function fetchStats(repo: string): Promise<Stats | undefined> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'User-Agent': 'chrischinchilla.com', Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data = await response.json();
    if (
      !Number.isInteger(data.stargazers_count) ||
      data.stargazers_count < 0 ||
      !Number.isInteger(data.forks_count) ||
      data.forks_count < 0
    ) {
      throw new Error('Invalid GitHub counts');
    }
    return { stars: data.stargazers_count, forks: data.forks_count, checked: new Date().toISOString().slice(0, 10) };
  } catch {
    console.warn(`Using saved GitHub stats for ${repo}`);
    return snapshot[repo as keyof typeof snapshot];
  }
}
