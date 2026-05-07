import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';
import { loadQuizResults } from '../lib/petcard-db';

const DISASTER_LABELS = {
  earthquake: '🌍 地震',
  typhoon: '🌀 台風',
  flood: '🌊 洪水・浸水',
};

const calcRank = (scores, maxScore) => {
  const avg = (scores.safety + scores.speed + scores.stress) / (maxScore * 3);
  if (avg >= 0.83) return 'S';
  if (avg >= 0.66) return 'A';
  if (avg >= 0.50) return 'B';
  if (avg >= 0.33) return 'C';
  return 'D';
};

const RANK_COLORS = {
  S: 'text-emerald-600 bg-emerald-50',
  A: 'text-blue-600 bg-blue-50',
  B: 'text-amber-600 bg-amber-50',
  C: 'text-orange-600 bg-orange-50',
  D: 'text-red-600 bg-red-50',
};

export default function MyPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadQuizResults().then((data) => {
      setResults([...data].reverse());
    });
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <header className={`${theme.header} px-5 py-4`}>
        <h1 className="font-bold text-lg">マイページ</h1>
        <p className="text-sm opacity-75">クイズ履歴・弱点確認</p>
      </header>

      <div className="p-5 space-y-5">
        {results.length === 0 ? (
          <div className={`${theme.card} p-8 text-center`}>
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-600 font-medium">まだクイズの記録がありません</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">
              シナリオクイズに挑戦してみましょう
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
            >
              クイズを始める
            </button>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                クイズ履歴
              </h2>
              <div className="space-y-3">
                {results.map((result, idx) => {
                  const rank = calcRank(result.scores, result.maxScore);
                  const rankStyle = RANK_COLORS[rank] || RANK_COLORS.D;
                  const date = new Date(result.savedAt || result.createdAt);
                  return (
                    <div key={idx} className={`${theme.card} p-4 flex items-center gap-4`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${rankStyle}`}>
                        {rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-700 text-sm">
                          {DISASTER_LABELS[result.disasterType] || result.disasterType}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{result.stageName}</p>
                        <p className="text-xs text-slate-400">
                          {date.toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400 space-y-0.5">
                        <p>安全 {Math.round((result.scores.safety / result.maxScore) * 100)}%</p>
                        <p>速度 {Math.round((result.scores.speed / result.maxScore) * 100)}%</p>
                        <p>ストレス {Math.round((result.scores.stress / result.maxScore) * 100)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 弱点分析 */}
            {results.length >= 2 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  弱点分析
                </h2>
                <WeakPointAnalysis results={results} theme={theme} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function WeakPointAnalysis({ results, theme }) {
  const totals = results.reduce(
    (acc, r) => ({
      safety: acc.safety + r.scores.safety,
      speed: acc.speed + r.scores.speed,
      stress: acc.stress + r.scores.stress,
      max: acc.max + r.maxScore,
    }),
    { safety: 0, speed: 0, stress: 0, max: 0 }
  );

  const axes = [
    { key: 'safety', label: '安全性', emoji: '🛡️' },
    { key: 'speed', label: 'スピード', emoji: '⚡' },
    { key: 'stress', label: 'ストレス管理', emoji: '💆' },
  ];

  const sorted = axes
    .map((a) => ({ ...a, pct: Math.round((totals[a.key] / totals.max) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className={`${theme.card} p-5`}>
      <p className="text-sm text-slate-500 mb-4">
        全{results.length}回の平均スコアに基づく分析
      </p>
      <div className="space-y-3">
        {sorted.map(({ key, label, emoji, pct }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700">
                {emoji} {label}
              </span>
              <span className={`text-sm font-bold ${pct < 50 ? 'text-red-500' : pct < 70 ? 'text-amber-500' : 'text-emerald-600'}`}>
                {pct}%
              </span>
            </div>
            <div className="bg-stone-100 rounded-full h-2">
              <div
                className={`rounded-full h-2 transition-all ${pct < 50 ? 'bg-red-400' : pct < 70 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {sorted[0].pct < 50 && (
        <p className="text-xs text-red-500 mt-3 bg-red-50 rounded-lg px-3 py-2">
          ⚠️ 「{sorted[0].label}」が弱点です。関連シナリオを繰り返し練習しましょう。
        </p>
      )}
    </div>
  );
}
