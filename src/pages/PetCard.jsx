import { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';
import { savePetCard, loadPetCard } from '../lib/petcard-db';

const FIELDS = [
  { key: 'name', label: 'ペットの名前', type: 'text', placeholder: 'ポチ' },
  { key: 'species', label: '種類・品種', type: 'text', placeholder: '柴犬' },
  { key: 'age', label: '年齢', type: 'text', placeholder: '3歳' },
  { key: 'color', label: '毛色・特徴', type: 'text', placeholder: '茶色、左耳に傷あり' },
  { key: 'chip', label: 'マイクロチップ番号', type: 'text', placeholder: '123456789012345' },
  { key: 'vaccine', label: '最終ワクチン接種日', type: 'date', placeholder: '' },
  { key: 'medicine', label: '服用中の薬・持病', type: 'text', placeholder: 'なし' },
  { key: 'allergy', label: 'アレルギー', type: 'text', placeholder: 'なし' },
  { key: 'ownerName', label: '飼い主氏名', type: 'text', placeholder: '山田 太郎' },
  { key: 'ownerPhone', label: '飼い主電話番号', type: 'tel', placeholder: '090-0000-0000' },
  { key: 'vetName', label: 'かかりつけ獣医院', type: 'text', placeholder: '○○動物病院' },
  { key: 'vetPhone', label: '獣医院電話番号', type: 'tel', placeholder: '03-0000-0000' },
  { key: 'memo', label: 'その他メモ', type: 'text', placeholder: '人見知りするので慎重に接触を' },
];

export default function PetCard() {
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPetCard().then((card) => {
      if (card) {
        setData(card);
      } else {
        setIsEditing(true);
      }
    });
  }, []);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await savePetCard(data);
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <header className={`${theme.header} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">ペット防災カルテ</h1>
            <p className="text-sm opacity-75">オフラインでも参照可能</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              編集
            </button>
          )}
        </div>
      </header>

      <div className="p-5">
        <div className={`${theme.card} overflow-hidden`}>
          <div className="bg-emerald-600 px-5 py-3 flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-white font-bold">防災カルテ</span>
            <span className="ml-auto text-white/60 text-xs">オフライン保存済み</span>
          </div>

          <div className="p-5 space-y-4">
            {FIELDS.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  {label}
                </label>
                {isEditing ? (
                  <input
                    type={type}
                    value={data[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                ) : (
                  <p className={`text-sm font-medium ${data[key] ? 'text-slate-800' : 'text-slate-300'}`}>
                    {data[key] || '未入力'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="px-5 pb-5 flex gap-3">
              {Object.keys(data).length > 0 && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-2 border-stone-200 text-slate-600 font-semibold rounded-xl py-3 hover:bg-stone-50 transition-colors"
                >
                  キャンセル
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-3 transition-colors"
              >
                保存する
              </button>
            </div>
          )}
        </div>

        {saved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium text-center">
            ✅ IndexedDB に保存しました（オフラインでも参照可能）
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mt-4">
          このカルテはお使いの端末に直接保存されます。
          <br />ネットワーク接続がない状態でも閲覧できます。
        </p>
      </div>
    </div>
  );
}
