```markdown
# CLAUDE.md — ペット防災シナリオクイズアプリ

## コンセプト
シナリオ分岐型クイズで飼い主の防災判断力を養うPWA。
ペットプロファイルによってシナリオ分岐が変化する疑似体験型。
ユーザーの年齢層に応じたテーマ切り替え、オフライン動作に対応。

## 技術スタック
| レイヤー | 技術 |
|---|---|
| フロントエンド | React (Vite) + PWA (vite-plugin-pwa) |
| スタイリング | Tailwind CSS |
| 認証 | Firebase Authentication（メール認証 + Google） |
| DB | Cloud Firestore + IndexedDb（オフライン） |
| シナリオデータ | JSONファイル（src/data/scenarios/） |
| チャート | Recharts（レーダーチャート） |
| 開発環境 | Docker + Firebase Emulator Suite |

## オフライン対応（最重要）
- `enableIndexedDbPersistence(db)` でFirestoreローカルキャッシュ有効化
- ペット防災カルテはIndexedDBにも二重保存（ネットなしで必ず参照可能）
- オフライン時はUI上に「オフラインモード」バナーを表示
- **理由：災害時はネット回線が遮断される。肝心な時に動かないアプリは意味がない**

## 認証・環境切り替え
```js
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
// オフライン永続化
enableIndexedDbPersistence(db);
```
- 開発：Firebase Emulator（モックGoogleログイン）
- 本番：Firebase本番（要OAuthクライアント設定）

## 世代別テーマ
設定画面からいつでも変更可能。ルートで`ageGroup`クラスを付与する方式。

```jsx
const themes = {
  youth:    "bg-slate-900 text-green-400 font-black",
  standard: "bg-stone-50  text-slate-800 font-sans",
  senior:   "bg-orange-50 text-slate-900 font-bold text-xl"
};

return (
  <div className={themes[userProfile.ageGroup]}>
    ...
  </div>
);
```

| テーマ | ターゲット | 特徴 |
|---|---|---|
| `youth` | Z世代・学生 | ダークモード、HP/MP風ステータス、バッジ、エフェクト |
| `standard` | 30〜50代 | アースカラー、アイコン多用、スッキリレイアウト |
| `senior` | シニア | 大きなボタン、高コントラスト、1画面1情報、文字1.5倍 |

## 主要機能
1. **シナリオクイズ** — 災害種別・ペットプロファイル選択→分岐クイズ→多角スコア
2. **マイページ** — 回答ログ・苦手問題復習・仮想防災バッグ
3. **ペット防災カルテ** — 写真・持病・ワクチン記録（オフライン参照保証）
4. **設定画面** — テーマ（年齢層）切り替え

## シナリオ構成
災害種別 × ステージの2軸で管理する。

```
src/data/scenarios/
├── earthquake/          # 地震
│   ├── stage1.json      # 避難準備編
│   ├── stage2.json      # 発生直後編
│   ├── stage3.json      # 同行避難編
│   └── stage4.json      # 避難生活編
├── typhoon/             # 台風
│   └── ...
└── flood/               # 洪水・浸水
    └── ...
```

## シナリオJSONの構造
```json
{
  "id": "eq-s1-q1",
  "disasterType": "earthquake",
  "stage": "避難準備編",
  "profiles": ["大型犬", "猫", "多頭飼い"],
  "question": "キャリーを嫌がって出てこない！どうする？",
  "choices": [
    {
      "text": "無理やり押し込む",
      "type": "risk",
      "score": { "safety": 1, "speed": 3, "stress": 0 },
      "feedback": "パニックで噛まれる危険があります。",
      "next": "eq-s1-q3"
    },
    {
      "text": "おやつで誘導する",
      "type": "better",
      "score": { "safety": 3, "speed": 2, "stress": 3 },
      "feedback": "日頃からキャリーを安心できる場所にしておくのが理想です。",
      "next": "eq-s1-q2"
    }
  ]
}
```
- `profiles`に含まれるプロファイルを選んだユーザーにのみ出題
- `next`は選択肢ごとに異なるIDを指定（完全分岐）
- `next: null` でステージ終了

## Firestoreデータ設計
```
users/{uid}/
  ├── profile        # ペット種別・テーマ設定（ageGroup含む）
  ├── answers/{qid}  # 回答ログ
  ├── scores/        # ステージ別スコア履歴
  └── bagItems/      # 防災バッグ取得済みアイテム
```

## スコア表示
- 軸：安全性・スピード・ストレス管理
- `youth`/`standard`：レーダーチャート + ランク表示
- `senior`：チャートより褒め言葉・アドバイス文章を優先

## ディレクトリ構成
```
/
├── Dockerfile
├── docker-compose.yml
├── firebase.json
├── firestore.rules
├── .env.local
├── public/
│   └── manifest.json
└── src/
    ├── firebase.js
    ├── themes/
    │   └── index.js
    ├── data/
    │   └── scenarios/
    │       ├── earthquake/
    │       ├── typhoon/
    │       └── flood/
    ├── components/
    ├── pages/
    └── App.jsx
```

## 開発環境の起動
```bash
docker compose up -d
docker compose exec app bash

# コンテナ内
firebase emulators:start --export-on-exit=./data --import=./data
npm run dev -- --host
```

## ポート
| 用途 | ポート |
|---|---|
| React (Vite) | 5173 |
| Firebase Emulator UI | 4000 |
| Auth Emulator | 9099 |
| Firestore Emulator | 8080 |

## 開発優先順位
1. `standard`テーマ ＋ 地震シナリオ「避難準備編」でプロトタイプ
2. オフライン対応を早期に組み込む（後付けは辛い）
3. 台風・洪水シナリオ追加
4. テーマ切り替え（youth / senior）

## 開発方針
- シナリオ追加・修正はJSONのみで完結（コード変更不要）
- テーマはCSSクラスの切り替えのみで対応（ロジック変更不要）
- `.env.local`は`.gitignore`に追加すること
```
