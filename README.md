# AI Hub

社内のAI関連情報を一箇所に集約し、チームの創造性を加速させるための社内ポータルツール。

## 概要

AI Hubは、以下の4つのカテゴリでAI関連情報を管理・共有するプラットフォームです：

- **💡 Ideas** - 「こんなの作りたい」を共有し、チームでブラッシュアップ
- **📚 Knowledge** - すぐ使えるプロンプト集とAI活用のベストプラクティス
- **🚀 Output** - 完成したAIツール、GPTs、エージェントのショーケース
- **📰 News** - 最新のAIニュースをAI要約付きでキャッチアップ

## プロジェクト構造

```
AI-hub/
├── README.md              # このファイル
├── SPECIFICATION.md       # 詳細仕様書
└── mockup/                # UIモックアップ
    ├── index.html         # メインダッシュボード
    ├── pages/             # カテゴリページ
    │   ├── ideas.html
    │   ├── knowledge.html
    │   ├── output.html
    │   ├── news.html
    │   └── post.html
    └── detail/            # 詳細ページ
        ├── idea.html
        ├── knowledge.html
        └── output.html
```

## モックアップの確認方法

ブラウザで `mockup/index.html` を開いてください：

```bash
open mockup/index.html
```

## 機能

### 実装済み（モックアップ）
- [x] ギャラリー/リストビュー切り替え
- [x] ダーク/ライトモード切り替え
- [x] 動的ネットワーク背景アニメーション
- [x] 全ページ間のナビゲーション
- [x] LocalStorageによる設定の永続化

### 今後の開発予定
- [ ] Next.js + Supabaseでのバックエンド構築
- [ ] ユーザー認証
- [ ] Discord連携
- [ ] AI機能（セマンティック検索、自動要約）

## 技術スタック（予定）

- **フロントエンド**: Next.js + Tailwind CSS
- **バックエンド**: Supabase（認証・DB・ストレージ）
- **外部連携**: Discord Bot API

## ライセンス

Private

---

詳細は [SPECIFICATION.md](./SPECIFICATION.md) を参照してください。

