import { NextResponse } from 'next/server';

const GH_USER = 'Avzolem';

export const revalidate = 600;

interface UserResponse {
  public_repos?: number;
}

interface SearchResponse {
  total_count?: number;
}

export async function GET() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'avsolem.com',
  };

  const [reposRes, commitsRes] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${GH_USER}`, {
      headers,
      next: { revalidate: 600 },
    }),
    fetch(
      `https://api.github.com/search/commits?q=author:${GH_USER}&per_page=1`,
      {
        headers,
        next: { revalidate: 600 },
      }
    ),
  ]);

  let repos = 0;
  let commits = 0;

  if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
    const data = (await reposRes.value.json()) as UserResponse;
    repos = data.public_repos ?? 0;
  }

  if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
    const data = (await commitsRes.value.json()) as SearchResponse;
    commits = data.total_count ?? 0;
  }

  return NextResponse.json({ repos, commits });
}
