import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { ScoreRadarChart } from '../components/ScoreRadarChart';
import { THEMES } from '../themes';
import { saveQuizResult } from '../lib/petcard-db';

const CHOICE_TYPE_LABELS = {
  best: { label: '◎ 最良', className: 'bg-emerald-100 text-emerald-800' },
  better: { label: '○ 良い', className: 'bg-blue-100 text-blue-800' },
  risk: { label: '△ 注意', className: 'bg-amber-100 text-amber-800' },
  danger: { label: '✕ 危険', className: 'bg-red-100 text-red-800' },
};

const calcRank = (scores, maxScore) => {
  const avg = (scores.safety + scores.speed + scores.stress) / (maxScore * 3);
  if (avg >= 0.83) return 'S';
  if (avg >= 0.66) return 'A';
  if (avg >= 0.50) return 'B';
  if (avg >= 0.33) return 'C';
  return 'D';
};

const RANK_MESSAGES = {
  S: '🏆 パーフェクト！防災エキスパートです',
  A: '⭐ 素晴らしい！しっかり備えができています',
  B: '✅ まずまずです。いくつか改善しましょう',
  C: '⚠️ もう少し備えが必要です',
  D: '🔴 今すぐ防災準備を始めましょう',
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  const state = location.state;

  useEffect(() => {
    if (!state) return;

    const result = {
      disasterType: state.disasterType,
      stage: state.stage,
      stageName: state.stageName,
      scores: state.scores,
      maxScore: state.maxScore,
      answers: state.answers,
      petType: profile.petType,
      createdAt: new Date().toISOString(),
    };

    saveQuizResult(result).catch(console.error);

    if (user) {
      const ref = doc(
        db,
        'users',
        user.uid,
        'scores',
        `${state.disasterType}-${state.stage}-${Date.now()}`
      );
      setDoc(ref, { ...result, createdAt: serverTimestamp() }).catch(console.error);
    }
  }, []);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-slate-500 mb-4">結果データがありません</p>
        <button onClick={() => navigate('/')} className="text-emerald-600 font-medium">
          ホームへ戻る
        </button>
      </div>
    );
  }

  const { scores, answers, disasterType, stage, stageName, maxScore } = state;
  const rank = calcRank(scores, maxScore);
  const rankColor = theme.rank[rank];

  return (
    <div className="max-w-lg mx-auto">
      <header className={`${theme.header} px-5 py-4`}>
        <h1 className="font-bold text-lg">クイズ結果</h1>
        <p className="text-sm opacity-75">{stageName}</p>
      </header>

      <div className="p-5 space-y-5">
        {/* ランク表示 */}
        <div className={`${theme.card} p-6 text-center`}>
          <p className="text-sm text-slate-500 font-medium mb-1">総合ランク</p>
          <div className={`text-7xl font-black ${rankColor}`}>{rank}</div>
          <p className="text-sm text-slate-600 mt-2">{RANK_MESSAGES[rank]}</p>
        </div>

        {/* レーダーチャート */}
        <div className={`${theme.card} p-5`}>
          <h2 className="font-semibold text-slate-700 mb-3">スコア分析</h2>
          <ScoreRadarChart scores={scores} maxScore={maxScore} />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { key: 'safety', label: '安全性' },
              { key: 'speed', label: 'スピード' },
              { key: 'stress', label: 'ストレス管理' },
            ].map(({ key, label }) => (
              <div key={key} className="text-center">
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-xl font-bold text-emerald-600">
                  {Math.round((scores[key] / maxScore) * 100)}
                  <span className="text-sm font-normal text-slate-400">%</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 回答振り返り */}
        <div className={`${theme.card} p-5`}>
          <h2 className="font-semibold text-slate-700 mb-4">回答の振り返り</h2>
          <div className="space-y-4">
            {answers.map((ans, idx) => {
              const typeInfo = CHOICE_TYPE_LABELS[ans.type];
              return (
                <div key={idx} className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
                  <p className="text-xs text-slate-400 font-medium mb-1">Q{idx + 1}</p>
                  <p className="text-sm text-slate-700 font-medium mb-2">{ans.question}</p>
                  <div className="flex items-start gap-2">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${typeInfo.className}`}>
                      {typeInfo.label}
                    </span>
                    <p className="text-sm text-slate-600">{ans.choice}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 bg-stone-50 rounded-lg px-3 py-2">
                    💬 {ans.feedback}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/quiz/${disasterType}/${stage}`)}
            className="flex-1 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl py-3 hover:bg-emerald-50 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-3 transition-colors"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}
