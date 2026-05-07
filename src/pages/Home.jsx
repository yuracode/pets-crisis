import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';
import { PetMascots } from '../components/PetMascots';

const PET_TYPES = ['小型犬', '大型犬', '猫', '多頭飼い', 'うさぎ・小動物', 'その他'];

const DISASTERS = [
  {
    type: 'earthquake',
    label: '地震',
    emoji: '🌍',
    iconAnim: 'quake-shake-strong',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50 border-amber-200',
    stages: [
      { num: 1, label: '避難準備編' },
      { num: 2, label: '発生直後編' },
    ],
  },
  {
    type: 'typhoon',
    label: '台風',
    emoji: '🌀',
    iconAnim: 'spin-slow',
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50 border-blue-200',
    stages: [
      { num: 1, label: '台風接近前編' },
    ],
  },
  {
    type: 'flood',
    label: '洪水・浸水',
    emoji: '🌊',
    iconAnim: 'pet-float',
    color: 'from-cyan-400 to-teal-500',
    bg: 'bg-cyan-50 border-cyan-200',
    stages: [
      { num: 1, label: '浸水・洪水対策編' },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  return (
    <div className="max-w-lg mx-auto">
      <header className={`${theme.header} px-5 py-4`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl pet-wiggle inline-block">🐾</span>
          <h1 className="text-lg font-bold">ペット防災クイズ</h1>
        </div>
      </header>

      <PetMascots petType={profile.petType} />

      <div className="p-5 space-y-6">
        {/* ペットプロファイル選択 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            あなたのペット
          </h2>
          <div className="flex flex-wrap gap-2">
            {PET_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => saveProfile({ petType: type })}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  profile.petType === type
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-300 text-slate-600 hover:border-emerald-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {!profile.petType && (
            <p className="text-amber-600 text-xs mt-2">
              ↑ ペットの種類を選ぶと、あなたに合ったシナリオが出題されます
            </p>
          )}
        </section>

        {/* 災害種別カード */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            シナリオを選ぶ
          </h2>
          <div className="space-y-4">
            {DISASTERS.map((disaster) => (
              <div key={disaster.type} className={`${theme.card} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${disaster.color} px-5 py-3 flex items-center gap-3`}>
                  <span className={`text-3xl inline-block ${disaster.iconAnim || ''}`}>{disaster.emoji}</span>
                  <span className="text-white font-bold text-lg">{disaster.label}</span>
                </div>
                <div className="p-4 space-y-2">
                  {disaster.stages.map((stage) => (
                    <button
                      key={stage.num}
                      onClick={() => navigate(`/quiz/${disaster.type}/${stage.num}`)}
                      className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 transition-all group"
                    >
                      <div>
                        <span className="text-xs text-slate-400 font-medium">
                          STAGE {stage.num}
                        </span>
                        <p className="font-semibold text-slate-700 group-hover:text-emerald-700">
                          {stage.label}
                        </p>
                      </div>
                      <span className="text-slate-300 group-hover:text-emerald-500 text-xl">›</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
