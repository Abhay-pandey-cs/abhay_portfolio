import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { DataStore } from '@/lib/storage';

async function safeFetch(url: string, init?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchGitHubStats(username: string) {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const user = await safeFetch(`https://api.github.com/users/${username}`, { headers });
    const repos = await safeFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });

    if (!user || !user.login) {
      return { username, available: false };
    }

    let totalStars = 0;
    let totalForks = 0;
    const languageCount: Record<string, number> = {};
    (Array.isArray(repos) ? repos : []).forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    const events = await safeFetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers });
    let totalCommits = 0;
    (Array.isArray(events) ? events : []).forEach((event: any) => {
      if (event.type === 'PushEvent' && Array.isArray(event.payload?.commits)) {
        totalCommits += event.payload.commits.length;
      }
    });

    return {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio || '',
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos || 0,
      followers: user.following || 0,
      following: user.following || 0,
      totalStars,
      totalForks,
      totalCommits,
      topLanguages,
      createdAt: user.created_at,
      updatedAt: new Date().toISOString(),
      available: true
    };
  } catch {
    return { username, available: false };
  }
}

async function fetchLeetCodeStats(username: string) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            ranking
            avatar
          }
          submitStatsGlobal {
            acEasy
            acMedium
            acHard
            totalSolved
            totalSubmitted
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
          totalRanking
          contestNum
        }
      }
    `;

    const response = await safeFetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioStats/1.0; +https://example.com)',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const matchedUser = response?.data?.matchedUser;
    const contestRanking = response?.data?.userContestRanking;

    if (!matchedUser) {
      return { username, available: false };
    }

    return {
      username: matchedUser.username,
      realName: matchedUser.profile?.realName || '',
      ranking: matchedUser.profile?.ranking || 0,
      avatar: matchedUser.profile?.avatar || '',
      totalSolved: matchedUser.submitStatsGlobal?.totalSolved || 0,
      acEasy: matchedUser.submitStatsGlobal?.acEasy || 0,
      acMedium: matchedUser.submitStatsGlobal?.acMedium || 0,
      acHard: matchedUser.submitStatsGlobal?.acHard || 0,
      totalSubmitted: matchedUser.submitStatsGlobal?.totalSubmitted || 0,
      contestRating: contestRanking?.rating || 0,
      globalRanking: contestRanking?.globalRanking || 0,
      totalRanking: contestRanking?.totalRanking || 0,
      contestNum: contestRanking?.contestNum || 0,
      updatedAt: new Date().toISOString(),
      available: true
    };
  } catch {
    return { username, available: false };
  }
}

async function fetchCodeChefStats(username: string) {
  try {
    const data = await safeFetch(`https://codechef-api.vercel.app/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioStats/1.0; +https://example.com)',
      },
    });

    if (!data || !data.username) {
      return { username, available: false };
    }

    return {
      username: data.username || username,
      fullName: data.fullname || '',
      rating: data.rating || 0,
      globalRank: data.globalRanking || 0,
      countryRank: data.countryRanking || 0,
      stars: data.stars || '',
      highestRating: data.highestRating || 0,
      problemsSolved: data.totalProblemsSolved || data.solved?.total || 0,
      problemsByDifficulty: {
        easy: data.solved?.easy || 0,
        medium: data.solved?.medium || 0,
        hard: data.solved?.hard || 0,
      },
      contests: data.contests || [],
      updatedAt: new Date().toISOString(),
      available: true
    };
  } catch {
    return { username, available: false };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const db = await getDatabase();
    let settings: any = {};
    if (db) {
      const settingsDoc = await db.collection('settings').findOne({ _id: 'site_settings' } as any);
      if (settingsDoc) {
        const { _id, ...rest } = settingsDoc as any;
        settings = rest;
      }
    }
    
    const githubUsername = searchParams.get('github') || settings.githubStatsUsername || settings.github?.replace('https://github.com/', '') || '';
    const leetcodeUsername = searchParams.get('leetcode') || settings.leetcode?.replace('https://leetcode.com/u/', '').replace(/\/+$/, '') || '';
    const codechefUsername = searchParams.get('codechef') || settings.codechef?.replace('https://www.codechef.com/users/', '').replace(/\/+$/, '') || '';

    const [github, leetcode, codechef] = await Promise.allSettled([
      githubUsername ? fetchGitHubStats(githubUsername) : Promise.resolve({ username: '', available: false }),
      leetcodeUsername ? fetchLeetCodeStats(leetcodeUsername) : Promise.resolve({ username: '', available: false }),
      codechefUsername ? fetchCodeChefStats(codechefUsername) : Promise.resolve({ username: '', available: false }),
    ]);

    return NextResponse.json({
      github: github.status === 'fulfilled' ? github.value : { username: githubUsername, available: false },
      leetcode: leetcode.status === 'fulfilled' ? leetcode.value : { username: leetcodeUsername, available: false },
      codechef: codechef.status === 'fulfilled' ? codechef.value : { username: codechefUsername, available: false },
      fetchedAt: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coding stats' },
      { status: 500 }
    );
  }
}
