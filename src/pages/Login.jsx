import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'メールアドレスが見つかりません',
        'auth/wrong-password': 'パスワードが正しくありません',
        'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
        'auth/weak-password': 'パスワードは6文字以上にしてください',
        'auth/invalid-email': 'メールアドレスの形式が正しくありません',
        'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
      };
      setError(messages[err.code] || `エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-2xl font-bold text-slate-800">ペット防災クイズ</h1>
          <p className="text-slate-500 mt-1 text-sm">シナリオで学ぶ、ペットとの防災</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">
            {isRegister ? '新規登録' : 'ログイン'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="6文字以上"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              {loading ? '処理中...' : isRegister ? '登録する' : 'ログイン'}
            </button>
          </form>

          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700 py-2"
          >
            {isRegister ? 'すでにアカウントをお持ちの方はこちら' : '新規登録はこちら'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 mb-2">— または —</p>
          <p className="text-xs text-slate-400">
            開発環境ではFirebase Emulatorが使用されます
          </p>
        </div>
      </div>
    </div>
  );
}
