import { NextResponse } from 'next/server';

// Pull from the site's own repo — most active and doesn't hit search-API rate limits.
const GH_USER = 'Avzolem';
const GH_REPO = 'avsolemdotcom';

export const revalidate = 600;

interface CommitResponse {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GH_USER}/${GH_REPO}/commits?per_page=3`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'avsolem.com',
        },
        next: { revalidate: 600 },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ commits: [], error: `GitHub ${res.status}` });
    }
    const data: CommitResponse[] = await res.json();
    const commits = data.map((item) => ({
      message: item.commit.message.split('\n')[0],
      repo: `${GH_USER}/${GH_REPO}`,
      sha: item.sha.slice(0, 7),
      date: item.commit.author.date,
      url: item.html_url,
    }));
    return NextResponse.json({ commits });
  } catch (err) {
    return NextResponse.json({
      commits: [],
      error: (err as Error).message,
    });
  }
}
