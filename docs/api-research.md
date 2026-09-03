# Third-Party API Research for Portfolio Coding Stats

> Target project stack: **Next.js 15 (App Router)** + **TypeScript** + **Tailwind CSS**
> Existing pattern: Server-side route handlers in `src/app/api/*/route.ts`, data layer in `src/lib/storage.ts`, client components in `src/components/`.

---

## 1. GitHub API

### 1.1 REST API (`https://api.github.com/`)

Unauthenticated requests are limited to **60 requests/hour per IP**. Authenticated requests (with a Personal Access Token) get **5,000 requests/hour**.

#### Core endpoints

| Metric | Endpoint |
|---|---|
| User profile (repos, followers, following) | `GET /users/{username}` |
| List public repos | `GET /users/{username}/repos` |
| List public events (contributions) | `GET /users/{username}/events/public` |
| Total commits per repo (contributors) | `GET /repos/{owner}/{repo}/contributors` |
| Languages per repo | `GET /repos/{owner}/{repo}/languages` |
| Rate-limit status | `GET /rate_limit` |

#### `GET /users/{username}` — response fields

```jsonc
{
  "login": "abhaypandey",
  "id": 123456789,
  "name": "Abhay Pandey",
  "bio": null,
  "avatar_url": "https://avatars.githubusercontent.com/u/123456789?v=4",
  "html_url": "https://github.com/abhaypandey",
  "public_repos": 18,
  "public_gists": 2,
  "followers": 42,
  "following": 37,
  "created_at": "2020-06-15T10:30:00Z",
  "updated_at": "2025-08-20T12:00:00Z"
}
```

**Headers to check rate limits:**
- `x-ratelimit-remaining` — requests left in current window
- `x-ratelimit-reset` — UTC epoch seconds when the window resets

#### `GET /users/{username}/events/public` — contributions

Returns a paginated array of public events. Each `PushEvent` has a `payload.commits` array. Count `PushEvent` entries (or sum commit lengths) for an approximate contribution count.

#### `GET /repos/{owner}/{repo}/languages`

```jsonc
{
  "JavaScript": 45200,
  "TypeScript": 38100,
  "CSS": 2100,
  "HTML": 1800
}
```

**Top languages** requires iterating all public repos and accumulating language byte counts. With N repos this needs N+1 requests — the GraphQL API is far more efficient.

### 1.2 GraphQL API (`https://api.github.com/graphql`)

**Endpoint:** `POST https://api.github.com/graphql`
**Auth:** `Authorization: Bearer <YOUR_PAT>` (fine-grained PAT or classic token)
**Rate limit:** 5,000 points/hour per authenticated user (cost = max(1, ceil(total_nodes / 100)).

#### Single query for comprehensive stats

```graphql
query GitHubStats($login: String!) {
  user(login: $login) {
    login
    name
    bio
    avatarUrl
    url
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    # Total public repos
    repositories(
      first: 100
      isLocked: false
      privacy: PUBLIC
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        name
        stargazerCount
        primaryLanguage {
          name
          color
        }
      }
    }
    # Top languages by byte size across repos
    repositoriesContributedTo(
      first: 100
      privacy: PUBLIC
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      nodes {
        nameWithOwner
        object(expression: "HEAD:") {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob {
                  text
                  size
                }
              }
            }
          }
        }
      }
    }
    # Contribution calendar (last year)
    contributionsCollection {
      totalCommitContributions
      totalRepositoryContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
  rateLimit {
    limit
    remaining
    used
    resetAt
  }
}
```

**Variables:**

```jsonc
{ "login": "abhaypandey" }
```

#### Top languages via GraphQL (single query, no N+1 problem)

```graphql
query TopLanguages($login: String!) {
  user(login: $login) {
    repositories(first: 100, isLocked: false, orderBy: { direction: DESC, field: STARGAZERS }) {
      nodes {
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          nodes {
            name
            color
            }
            }
            totalSize
          }
        }
      }
    }
  }
}
```

This returns language byte counts across all repositories in a single request. Sum `size` per language in `nodes` to get a top-languages breakdown.

### 1.3 Unofficial: GitHub Readme Stats (`https://github.com/anuraghazra/github-readme-stats`)

A popular, widely-used service that returns stats as **SVG images** or **JSON**. No auth required, but rate-limited and best-effort.

| Card | Endpoint | Response |
|---|---|---|
| Stats card | `https://github-readme-stats.vercel.app/api?username={username}` | SVG |
| Stats JSON | `https://github-readme-stats.vercel.app/api?username={username}&format=json` | JSON |
| Top languages | `https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=donut` | SVG |
| Top languages JSON | `https://github-readme-stats.vercel.app/api/top-langs/?username={username}&format=json` | JSON |
| Pinned repos | `https://github-readme-stats.vercel.app/api/pin/?username={username}&repo={repo}` | SVG |

**Stats JSON response sample:**

```jsonc
{
  "name": "abhaypandey",
  "totalrepo": 18,
  "totalstars": 42,
  "totalcommits": 251,
  "totalpulls": 3,
  "totalissues": 5,
  " contributedrepositories": 4,
  "name_length": 14,
  "rank": {
    "level": "A+",
    "score": 98.51
  }
}
```

**Recommendation for production portfolios:** Use the GraphQL API directly (in a Next.js route handler on the server) for full control. Use `github-readme-stats` if you want pre-rendered SVG badges with zero backend logic.

---

## 2. LeetCode API

### 2.1 Official GraphQL API (`https://leetcode.com/graphql`)

**Endpoint:** `POST https://leetcode.com/graphql`
**Headers:** `Content-Type: application/json`
**Auth:** None required for public data. For some queries, `LEETCODE_SESSION` and `csrftoken` cookies are needed.
**Note:** LeetCode uses Cloudflare which may return `403` for automated requests without proper headers.

#### Query 1: User profile & problems solved by difficulty

```graphql
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      ranking
      reputation
      userAvatar
      countryName
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
}
```

**Variables:**

```jsonc
{ "username": "abhaypandey" }
```

**Response:**

```jsonc
{
  "data": {
    "matchedUser": {
      "username": "abhaypandey",
      "profile": {
        "realName": "Abhay Pandey",
        "ranking": 7842,
        "reputation": 1250,
        "userAvatar": "https://assets.leetcode.com/...",
        "countryName": "India"
      },
      "submitStats": {
        "acSubmissionNum": [
          { "difficulty": "All", "count": 254, "submissions": 602 },
          { "difficulty": "Easy", "count": 184, "submissions": 302 },
          { "difficulty": "Medium", "count": 66, "submissions": 180 },
          { "difficulty": "Hard", "count": 4, "submissions": 20 }
        ]
      }
    }
  }
}
```

#### Query 2: Contest ranking & history

```graphql
query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
```

**Response:**

```jsonc
{
  "data": {
    "userContestRanking": {
      "attendedContestsCount": 12,
      "rating": 1456,
      "globalRanking": 7842,
      "totalParticipants": 25100,
      "topPercentage": 31.29,
      "badge": null
    },
    "userContestRankingHistory": [
      {
        "attended": true,
        "trendDirection": "UP",
        "problemsSolved": 3,
        "totalProblems": 4,
        "finishTimeInSeconds": 4520,
        "rating": 1456,
        "ranking": 5234,
        "contest": {
          "title": "Weekly Contest 412",
          "startTime": 1722897600
        }
      }
    ]
  }
}
```

#### Query 3: Recent accepted submissions

```graphql
query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
  }
}
```

**Variables:**

```jsonc
{ "username": "abhaypandey", "limit": 15 }
```

**Response:**

```jsonc
{
  "data": {
    "recentAcSubmissionList": [
      {
        "id": 1234567890,
        "title": "Two Sum",
        "titleSlug": "two-sum",
        "timestamp": "1724879976"
      }
    ]
  }
}
```

#### Query 4: Activity calendar / submission heatmap

```graphql
query userProfileCalendar($username: String!, $year: Int) {
  matchedUser(username: $username) {
    userCalendar(year: $year) {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}
```

**Response:**

```jsonc
{
  "data": {
    "matchedUser": {
      "userCalendar": {
        "activeYears": [2023, 2024, 2025],
        "streak": 45,
        "totalActiveDays": 183,
        "submissionCalendar": "{\"2024-01-01\": 3, \"2024-01-02\": 5, ...}"
      }
    }
  }
}
```

### 2.2 Unofficial REST wrappers

These wrap the GraphQL API behind convenient REST endpoints:

| Service | Base URL | Key endpoints |
|---|---|---|
| **alfa-leetcode-api** | `https://alfa-leetcode-api.onrender.com` | `/{username}` profile, `/{username}/solved`, `/{username}/contest`, `/{username}/language`, `/{username}/calendar` |
| **LeetFetch** | `https://leetfetch.vercel.app` | GraphQL proxy explorer (15 endpoints) |
| **leetcode-query (NPM)** | SDK for `@napi.rs/crossor... ` — uses `https://leetcode.com/graphql` internally with custom rate limiter (default 20 req / 10 sec) |

**Recommended: call `https://leetcode.com/graphql` directly** in a Next.js route handler to avoid depending on a third-party Vercel deployment. Add a `User-Agent` header and use `POST` with JSON body `{ query, variables }`.

---

## 3. CodeChef API

### 3.1 Official API (`https://api.codechef.com/`)

**Base URL:** `https://api.codechef.com/`
**Auth:** OAuth 2.0 Client Credentials flow — requires registering an app at [CodeChef OAuth Apps](https://codeforces.com/) (wait, actually `https://codechef.com/oauth` or the developer console).

OAuth flow:

1. `GET /oauth/authorize?client_id={id}&redirect_uri={uri}&response_type=code&state={state}` — user redirection and authorization code
2. `POST /oauth/token` with `client_id`, `client_secret`, `grant_type=authorization_code`, `code={auth_code}`, `redirect_uri={uri}` — exchange for access token

**Headers for all requests:**
`Authorization: Bearer <access_token>`

#### `GET /users/{username}`

Response:

```jsonc
{
  "status": "OK",
  "result": {
    "user": {
      "username": "abhaypandey",
      "real_name": "Abhay Pandey",
      "country": "India"
    },
    "rating": 1684,
    "global_rank": 63200,
    "country_rank": 52300,
    "stars": 3,
    "highest_rating": 1845,
    "highest_global_rank": 48200,
    "highest_country_rank": 40100,
    "problems_solved": {
      "practice": {
        "easy": 55,
        "easy_score": 55,
        "medium": 23,
        "medium_score": 46,
        "hard": 3,
        "hard_score": 9,
        "total": 81,
        "total_score": 110
      },
      "contests": { ... }
    },
    "last_online": 1724275200,
    "first_submission": 1598697600,
    "consent": true,
    "created_using": "codechef-web",
    "country_rank": 52300,
    "contests_solved": 12,
    "contests_participated": 25
  }
}
```

**Limitations:** Requires OAuth2, the API can be finicky, and CodeChef's official docs are sparse. The OAuth token refresh flow adds complexity.

### 3.2 Unofficial API: `https://codechef-api.vercel.app/{username}`

From the Codeforces discussion ([blog/entry/113808](https://codeforces.com/blog/entry/113808)), a widely-used community endpoint:

```
GET https://codechef-api.vercel.app/{username}
```

**Response:**

```jsonc
{
  "status": "OK",
  "result": {
    "user": {
      "username": "abhaypandey",
      "real_name": "Abhay Pandey",
      "country": "India"
    },
    "rating": 1684,
    "global_rank": 63200,
    "country_rank": 52300,
    "stars": 3,
    "highest_rating": 1845,
    "highest_global_rank": 48200,
    "highest_country_rank": 40100,
    "problems_solved": {
      "practice": {
        "easy": 55,
        "medium": 23,
        "hard": 3,
        "total": 81
      }
    },
    "contests_solved": 12,
    "contests_participated": 25
  }
}
```

> **Warning:** This is an unofficial, community-hosted Vercel function that scrapes `codechef.com/users/{username}`. It has **no SLA** and can break when CodeChef changes their HTML. For a production portfolio you should either wrap it behind your own server-side cache or implement your own scraper.

### 3.3 Unofficial API: `https://codechef-api.vercel.app/handle/{username}`

Newer endpoint format (from [deepaksuthar40128/Codechef-API](https://github.com/deepaksuthar40128/Codechef-API)):

```
GET https://codechef-api.vercel.app/handle/{username}
```

Returns the same structure as above but with additional fields for submission stats and heatmap data.

### 3.4 Unofficial API: codeindex / parse.bot

A managed, paid tier API at `https://api.parse.bot/scraper/{id}/get_user_info?username={username}`. Returns `date_versus_rating` (rating history array) and `user_initial_ratings`. Rate-limited per tier (Free: 5 req/min, $30/mo for 20 req/min, etc.). Uses `X-API-Key` header.

---

## 4. General Best Practices for Next.js (App Router)

### 4.1 Server-side vs Client-side fetching

This project uses **`'use client'`** components (e.g., `page.tsx`) with route handlers in `src/app/api/*/route.ts`. The recommended pattern:

**Server-side (route handler) — preferred for third-party API calls:**

Create an API route handler that proxies the third-party request. This hides tokens, avoids CORS, and centralizes caching logic:

```ts
// src/app/api/github-stats/route.ts
import { NextResponse } from 'next/server';

const TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
        'User-Agent': 'abhay-portfolio',
      },
      // Cache for 10 minutes
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

**Client-side fetching (for display):**

In a client component, call your own route handler:

```tsx
// src/components/sections/CodingProfilesSection.tsx
import { useEffect, useState } from 'react';

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
}

export const CodingProfilesSection: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = settings.githubStatsUsername || 'abhaypandey';
    fetch(`/api/github-stats?username=${username}`)
      .then(r => r.json())
      .then(data => {
        setGithubStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [settings.githubStatsUsername]);

  // ... render stats or loading skeleton
};
```

### 4.2 Caching strategies

**Next.js `fetch` with `next: { revalidate }`:**

```ts
const res = await fetch(url, { next: { revalidate: 3600 } }); // ISR — revalidate every hour
```

This is the simplest approach for route handlers. Data is cached at the edge/server level and shared across all users.

**In-memory cache (for self-hosted scrapers):**

```ts
// src/lib/cache.ts
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string, ttlMs: number): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}
```

**Client-side polling with `useSWR` or React Query:**

```tsx
import useSWR from 'swr';

const { data, error, isValidating } = useSWR(
  `/api/leetcode-stats?username=${username}`,
  (url) => fetch(url).then(r => r.json()),
  { refreshInterval: 300000 } // revalidate every 5 minutes
);
```

### 4.3 CORS handling

Third-party APIs (LeetCode, CodeChef) may not send CORS headers suitable for browser-side requests:

| API | Browser-side CORS | Workaround |
|---|---|---|
| GitHub REST | Yes | Works, but 60 req/hr limit applies to browser IP |
| GitHub GraphQL | Yes (CORS enabled) | Works, but expose PAT in browser is a security risk |
| LeetCode GraphQL | No (may get 403) | Must proxy through Next.js route handler |
| CodeChef official | Yes | Requires OAuth2 — do server-side |
| CodeChef unofficial | No | Must proxy through route handler |

**Best practice:** Proxy all third-party calls through your own `api/` route handlers so:
1. Tokens are never exposed client-side
2. CORS is never an issue
3. You implement a single caching layer
4. Rate limits are managed server-side

### 4.4 Rate limit handling

**Exponential backoff pattern (route handler):**

```ts
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res;

    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset');
      let delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s

      if (reset) {
        const resetMs = parseInt(reset, 10) * 1000 - Date.now();
        if (resetMs > 0 && resetMs < 300000) { // Don't wait more than 5 min
          delay = resetMs;
        }
      }

      await new Promise(r => setTimeout(r, delay));
      continue;
    }

    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  throw new Error('Max retries exceeded');
}
```

### 4.5 Unified stats API (recommended pattern for this project)

Create a single endpoint that orchestrates all three services:

```ts
// src/app/api/coding-stats/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'abhaypandey';

  // Fetch all three in parallel, cache for 1 hour
  const [github, leetcode, codechef] = await Promise.allSettled([
    fetchGitHubStats(username),
    fetchLeetCodeStats(username),
    fetchCodeChefStats(username),
  ]);

  return NextResponse.json({
    github: github.status === 'fulfilled' ? github.value : null,
    leetcode: leetcode.status === 'fulfilled' ? leetcode.value : null,
    codechef: codechef.status === 'fulfilled' ? codechef.value : null,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' }, // CDN cache 1 hour
  });
}
```

Client-side:

```tsx
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function StatsCards({ username }: { username: string }) {
  const { data, error, isFetching } = useSWR(
    `/api/coding-stats?username=${username}`,
    fetcher,
    { refreshInterval: 600000 } // 10 min refresh
  );

  if (error || !data) return <StatsLoadingSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <GitHubStatsCard stats={data.github} />
      <LeetCodeStatsCard stats={data.leetcode} />
      <CodeChefStatsCard stats={data.codechef} />
    </div>
  );
}
```

### 4.6 Environment variables

Store tokens in `.env.local` (never commit):

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CODECHEF_CLIENT_ID=your_client_id
CODECHEF_CLIENT_SECRET=your_client_secret
```

Access in route handlers via `process.env.GITHUB_TOKEN` (server-only, never exposed to client bundle).

### 4.7 Summary comparison table

| Platform | Best API | Endpoint | Auth required | Rate limit | Response format |
|---|---|---|---|---|---|
| GitHub | REST `/users/{u}` | `https://api.github.com/users/{u}` | Optional (pat = 5k/hr, none = 60/hr) | 60/hr unauth, 5k/hr auth | JSON |
| GitHub | GraphQL | `https://api.github.com/graphql` | Required (pat) | 5k points/hr | JSON |
| GitHub | github-readme-stats | `https://github-readme-stats.vercel.app/api?username={u}&format=json` | No | 30/hr (free instance) | JSON |
| LeetCode | GraphQL | `https://leetcode.com/graphql` | No (public data) | IP-based, ~50 req/hr | JSON |
| LeetCode | alfa-leetcode-api | `https://alfa-leetcode-api.onrender.com/{u}` | No | Best-effort | JSON |
| CodeChef | Official API | `https://api.codechef.com/users/{u}` | Required (OAuth2) | 1k req/hr after auth | JSON |
| CodeChef | Unofficial | `https://codechef-api.vercel.app/{u}` | No | IP-based, no SLA | JSON |
| CodeChef | codeindex (Parse) | `https://api.parse.bot/scraper/{id}/get_user_info` | API key (paid) | Varies by tier | JSON |
```
