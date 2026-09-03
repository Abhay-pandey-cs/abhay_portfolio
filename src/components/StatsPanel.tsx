'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Trophy, RefreshCw,
  BarChart3, ExternalLink, MessageCircle
} from 'lucide-react';
import { GitHubStats, LeetCodeStats, CodeChefStats, CodingStats, SiteSettings } from '@/types';
import { GithubIcon, LeetCodeIcon, CodeChefIcon } from '@/components/icons/BrandIcons';

interface StatsPanelProps {
  settings: SiteSettings;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ settings }) => {
  const [stats, setStats] = useState<CodingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const githubUser = settings.github?.replace('https://github.com/', '') || '';
      const leetcodeUser = settings.leetcode?.replace('https://leetcode.com/u/', '') || settings.leetcode || '';
      const codechefUser = settings.codechef?.replace('https://www.codechef.com/users/', '') || settings.codechef || '';

      const params = new URLSearchParams();
      if (githubUser) params.set('github', githubUser);
      if (leetcodeUser) params.set('leetcode', leetcodeUser);
      if (codechefUser) params.set('codechef', codechefUser);

      const res = await fetch(`/api/stats/coding?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const githubStats = stats?.github as GitHubStats | undefined;
  const leetcodeStats = stats?.leetcode as LeetCodeStats | undefined;
  const codechefStats = stats?.codechef as CodeChefStats | undefined;
  const hasError = (s: any): s is { error: string; username: string } =>
    s && typeof s === 'object' && 'error' in s;
  const isUnavailable = (s: any): boolean =>
    s && typeof s === 'object' && 'available' in s && s.available === false;

  const handleWhatsAppRedirect = () => {
    let statsSummary = '📊 Coding Stats:\n';
    if (githubStats) {
      statsSummary += `- GitHub: ${githubStats.totalStars}★, ${githubStats.followers}👥 followers, ${githubStats.totalCommits} commits\n`;
    }
    if (leetcodeStats) {
      statsSummary += `- LeetCode: ${leetcodeStats.totalSolved} solved, Rating: ${leetcodeStats.contestRating || 'N/A'}\n`;
    }
    if (codechefStats) {
      statsSummary += `- CodeChef: ${codechefStats.rating || 'N/A'}, Rank #${codechefStats.globalRank || 'N/A'}\n`;
    }

    const message = encodeURIComponent(
      `Hey Abhay, I came across your portfolio and I'm interested in connecting with you.`
    );

    const whatsappNumber = settings.whatsappNumber;
    if (!whatsappNumber) return;
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#5865f2]" />
          <span className="text-xs font-bold text-white font-mono">STATS</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleWhatsAppRedirect}
            className="p-1 text-gray-400 hover:text-[#25d366] transition-colors"
            title="WhatsApp with stats"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Refresh stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-400 text-xs font-mono">
          Fetching live stats...
        </div>
      )}

      {error && (
        <div className="text-center py-3 text-gray-400 text-[10px] font-mono">
          Stats are currently unavailable. They may be loading or temporarily inaccessible.
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* Daily Streak & Rank Box - Top */}
          <div className="p-2 rounded-lg bg-[#141518] border border-[#2e3038]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-400 font-mono">DAILY STREAK</span>
                <span className="text-[9px] text-gray-400 font-mono">RANK</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#5865f2]" />
                  <span className="text-sm font-bold text-[#5865f2]">
                    {leetcodeStats?.contestNum || 0} contests
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[#f0b232]" />
                  <span className="text-sm font-bold text-[#f0b232]">
                    #{leetcodeStats?.globalRanking || codechefStats?.globalRank || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Stats */}
          <div className="p-2 rounded-lg bg-[#141518] border border-[#2e3038]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <GithubIcon className="w-4 h-4" />
                <span className="text-xs font-bold text-white">GitHub</span>
              </div>
              {settings.github && (
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-gray-500 hover:text-gray-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {hasError(stats?.github) || isUnavailable(stats?.github) ? (
              <div className="text-[9px] text-gray-400">GitHub stats are currently unavailable.</div>
            ) : githubStats ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Stars</span>
                  <span className="text-sm font-bold text-[#f0b232]">{githubStats.totalStars}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Followers</span>
                  <span className="text-sm font-bold text-[#38bdf8]">{githubStats.followers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Commits</span>
                  <span className="text-sm font-bold text-[#38bdf8]">{githubStats.totalCommits}</span>
                </div>
                {/* Top Languages */}
                {githubStats.topLanguages && githubStats.topLanguages.length > 0 && (
                  <div className="pt-1.5">
                    <div className="text-[9px] text-gray-400 font-mono mb-1">Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {githubStats.topLanguages.map((lang) => (
                        <span key={lang.language} className="text-[9px] text-gray-300 bg-[#2e3038]/50 px-1.5 py-0.5 rounded">
                          {lang.language} ({lang.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[9px] text-gray-500">No data</div>
            )}
          </div>

          {/* LeetCode Stats */}
          <div className="p-2 rounded-lg bg-[#141518] border border-[#2e3038]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <LeetCodeIcon className="w-4 h-4" />
                <span className="text-xs font-bold text-white">LeetCode</span>
              </div>
              {settings.leetcode && (
                <a
                  href={settings.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-gray-500 hover:text-gray-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {hasError(stats?.leetcode) || isUnavailable(stats?.leetcode) ? (
              <div className="text-[9px] text-gray-400">LeetCode stats are currently unavailable.</div>
            ) : leetcodeStats ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Solved</span>
                  <span className="text-sm font-bold text-[#f0b232]">{leetcodeStats.totalSolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Rating</span>
                  <span className="text-sm font-bold text-[#5865f2]">{leetcodeStats.contestRating || 'N/A'}</span>
                </div>
                {/* Difficulty breakdown */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 text-center">
                    <div className="text-xs font-bold text-[#23a55a]">{leetcodeStats.acEasy}</div>
                    <div className="text-[8px] text-gray-500">Easy</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-xs font-bold text-[#f0b232]">{leetcodeStats.acMedium}</div>
                    <div className="text-[8px] text-gray-500">Medium</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-xs font-bold text-[#ef4444]">{leetcodeStats.acHard}</div>
                    <div className="text-[8px] text-gray-500">Hard</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-gray-500">No data</div>
            )}
          </div>

          {/* CodeChef Stats */}
          <div className="p-2 rounded-lg bg-[#141518] border border-[#2e3038]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CodeChefIcon className="w-4 h-4" />
                <span className="text-xs font-bold text-white">CodeChef</span>
              </div>
              {settings.codechef && (
                <a
                  href={settings.codechef}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-gray-500 hover:text-gray-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {hasError(stats?.codechef) || isUnavailable(stats?.codechef) ? (
              <div className="text-[9px] text-gray-400">CodeChef stats are currently unavailable.</div>
            ) : codechefStats ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Rating</span>
                  <span className="text-sm font-bold text-[#f0b232]">{codechefStats.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Global Rank</span>
                  <span className="text-sm font-bold text-[#23a55a]">#{codechefStats.globalRank || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Solved</span>
                  <span className="text-sm font-bold text-[#5865f2]">{codechefStats.problemsSolved || 0}</span>
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-gray-500">No data</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
