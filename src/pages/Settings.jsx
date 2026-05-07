import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';

const AGE_GROUPS = [
  { key: 'youth', emoji: '🎮', desc: 'ゲーム風・ダークモード' },
  { key: 'standard', emoji: '🌿', desc: 'アースカラー・スッキリ' },
  { key: 'senior', emoji: '🔆', desc: '大きなボタン・高コントラスト' },
];

const PET_TYPES = ['小型犬', '大型犬', '猫', '多頭飼い', 'うさぎ・小動物', 'その他'];

export default function Settings() {
  const { user, logout } = useAuth();
  const { profile, saveProfile } = useProfile();
  const navigate = useNavigate();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-lg mx-auto">
      <header className={`${theme.header} px-5 py-4`}>
        <h1 className="font-bold text-lg">設定</h1>
      </header>

      <div className="p-5 space-y-6">
        {/* テーマ選択 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            テーマ（年齢層）
          </h2>
          <div className="space-y-2">
            {AGE_GROUPS.map(({ key, emoji, desc }) => {
              const t = THEMES[key];
              const isActive = profile.ageGroup === key;
              return (
                <button
                  key={key}
                  onClick={() => saveProfile({ ageGroup: key })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="text-left flex-1">
                    <p className={`font-semibold text-sm ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  {isActive && (
                    <span className="text-emerald-500 text-xl">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ペット種別 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            ペットの種類
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
        </section>

        {/* アカウント情報 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            アカウント
          </h2>
          <div className={`${theme.card} p-4`}>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-400">メールアドレス: </span>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full border-2 border-red-200 text-red-500 font-semibold rounded-xl py-3 hover:bg-red-50 transition-colors"
          >
            ログアウト
          </button>
        </section>

        <p className="text-xs text-slate-300 text-center">
          ペット防災クイズ v0.1.0
        </p>
      </div>
    </div>
  );
}
