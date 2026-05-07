import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';
import { DisasterEffect } from '../components/DisasterEffect';

const CHOICE_TYPE_LABELS = {
  best: { label: '◎ 最良', className: 'bg-emerald-100 text-emerald-800' },
  better: { label: '○ 良い', className: 'bg-blue-100 text-blue-800' },
  risk: { label: '△ 注意', className: 'bg-amber-100 text-amber-800' },
  danger: { label: '✕ 危険', className: 'bg-red-100 text-red-800' },
};

const SCENARIO_MODULES = {
  earthquake: {
    1: () => import('../data/scenarios/earthquake/stage1.json'),
    2: () => import('../data/scenarios/earthquake/stage2.json'),
  },
  typhoon: {
    1: () => import('../data/scenarios/typhoon/stage1.json'),
  },
  flood: {
    1: () => import('../data/scenarios/flood/stage1.json'),
  },
};

export default function Quiz() {
  const { disasterType, stage } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  const [questions, setQuestions] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState({ safety: 0, speed: 0, stress: 0 });
  const [answers, setAnswers] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = SCENARIO_MODULES[disasterType]?.[parseInt(stage)];
    if (!loader) {
      navigate('/');
      return;
    }
    loader().then((mod) => {
      const list = mod.default;
      const map = Object.fromEntries(list.map((q) => [q.id, q]));
      setQuestions(map);
      setCurrentId(list[0].id);
      setTotalQuestions(list.length);
      setLoading(false);
    });
  }, [disasterType, stage, navigate]);

  const currentQuestion = questions[currentId];
  const answeredCount = answers.length;

  const handleChoiceClick = (choice, index) => {
    if (showFeedback) return;
    setSelectedChoice({ ...choice, index });
    setShowFeedback(true);

    setScores((prev) => ({
      safety: prev.safety + choice.score.safety,
      speed: prev.speed + choice.score.speed,
      stress: prev.stress + choice.score.stress,
    }));

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentId,
        question: currentQuestion.question,
        choice: choice.text,
        type: choice.type,
        feedback: choice.feedback,
        score: choice.score,
      },
    ]);
  };

  const handleNext = () => {
    if (!selectedChoice) return;

    if (selectedChoice.next === null) {
      const maxScore = totalQuestions * 3;
      navigate('/results', {
        state: {
          scores,
          answers,
          disasterType,
          stage: parseInt(stage),
          stageName: currentQuestion.stage,
          maxScore,
        },
      });
      return;
    }

    setCurrentId(selectedChoice.next);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  if (loading || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">読み込み中...</p>
      </div>
    );
  }

  const progress = ((answeredCount) / totalQuestions) * 100;

  return (
    <DisasterEffect disasterType={disasterType}>
    <div className="max-w-lg mx-auto relative">
      <header className={`${theme.header} px-5 py-4`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ‹
          </button>
          <div className="flex-1">
            <p className="text-xs opacity-75">{currentQuestion.stage}</p>
            <p className="text-sm font-semibold">
              Q{answeredCount + 1} / {totalQuestions}
            </p>
          </div>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-1.5">
          <div
            className="bg-white rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="p-5 space-y-5">
        <div className={`${theme.card} p-5`}>
          <p className="text-base font-semibold text-slate-800 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        <div className="space-y-3">
          {currentQuestion.choices.map((choice, idx) => {
            const isSelected = selectedChoice?.index === idx;
            const typeInfo = CHOICE_TYPE_LABELS[choice.type];

            return (
              <div key={idx}>
                <button
                  onClick={() => handleChoiceClick(choice, idx)}
                  disabled={showFeedback}
                  className={`w-full text-left border-2 rounded-xl px-5 py-4 transition-all font-medium ${
                    showFeedback
                      ? isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-stone-50 border-stone-200 text-slate-400'
                      : 'bg-white hover:bg-emerald-50 border-stone-200 hover:border-emerald-400 text-slate-800 cursor-pointer'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-normal">
                    {String.fromCharCode(65 + idx)}.{' '}
                  </span>
                  {choice.text}
                </button>

                {showFeedback && isSelected && (
                  <div className="mt-2 rounded-xl px-4 py-3 bg-stone-50 border border-stone-200">
                    <span
                      className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${typeInfo.className}`}
                    >
                      {typeInfo.label}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {choice.feedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-4 transition-colors text-base"
          >
            {selectedChoice?.next === null ? '結果を見る →' : '次の問題へ →'}
          </button>
        )}
      </div>
    </div>
    </DisasterEffect>
  );
}
