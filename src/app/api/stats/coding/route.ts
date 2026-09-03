import { NextResponse } from 'next/server';

// Fetch GitHub user stats
async function fetchGitHubStats(username: string) {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch basic user info
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status}`);
    }
    const user = await userRes.json();

    // Fetch user's repositories for language stats
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Calculate total stars, forks, and language distribution
    let totalStars = 0;
    let totalForks = 0;
    const languageCount: Record<string, number> = {};

    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    // Get top languages
    const topLanguages = Object.entries(languageCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count }));

    // Fetch contribution stats using the user's contribution calendar
    // This requires a different approach - we'll use the user events API
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers });
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Count recent commits (PushEvents)
    let totalCommits = 0;
    const dailyActivity: Record<string, number> = {};
    events.forEach((event: any) => {
      if (event.type === 'PushEvent' && event.payload.commits) {
        const commitCount = event.payload.commits.length;
        totalCommits += commitCount;
        const date = event.created_at.split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + commitCount;
      }
    });

    return {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio || '',
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      totalStars,
      totalForks,
      totalCommits,
      topLanguages,
      createdAt: user.created_at,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('GitHub stats fetch error:', error);
    return { error: 'Failed to fetch GitHub stats', username };
  }
}

// Fetch LeetCode stats via GraphQL
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
            websites
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

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (portfolio-stats-fetcher)',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();
    const matchedUser = data.data?.matchedUser;
    const contestRanking = data.data?.userContestRanking;

    if (!matchedUser) {
      return { error: 'LeetCode user not found', username };
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
    };
  } catch (error) {
    console.error('LeetCode stats fetch error:', error);
    return { error: 'Failed to fetch LeetCode stats', username };
  }
}

// Fetch CodeChef stats
async function fetchCodeChefStats(username: string) {
  try {
    // Use the unofficial CodeChef API
    const response = await fetch(`https://codechef-api.vercel.app/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (portfolio-stats-fetcher)',
      },
    });

    if (!response.ok) {
      throw new Error(`CodeChef API error: ${response.status}`);
    }

    const data = await response.json();

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
    };
  } catch (error) {
    console.error('CodeChef stats fetch error:', error);
    return { error: 'Failed to fetch CodeChef stats', username };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const githubUsername = searchParams.get('github') || 'abhaypandey';
    const leetcodeUsername = searchParams.get('leetcode') || 'abhaypandey';
    const codechefUsername = searchParams.get('codechef') || 'abhaypandey';

    // Fetch all stats in parallel using Promise.allSettled
    const results = await Promise.allSettled([
      fetchGitHubStats(githubUsername),
      fetchLeetCodeStats(leetcodeUsername),
      fetchCodeChefStats(codechefUsername),
    ]);

    return NextResponse.json({
      github: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
      leetcode: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
      codechef: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason },
      fetchedAt: new Date().toISOString(),
    }, {
      // Cache for 10 minutes since stats don't change frequently
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
