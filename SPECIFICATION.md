# AI Hub 仕様書

## 概要

AI Hubは、社内のAI関連情報を一箇所に集約し、チームの創造性を加速させるための社内ポータルツールです。

---

## 1. システム構成

### 1.1 技術スタック（推奨）
- **フロントエンド**: Next.js + Tailwind CSS
- **バックエンド**: Supabase（認証・DB・ストレージ）
- **外部連携**: Discord Bot API

### 1.2 ページ構成
```
【メインページ】
index-gallery.html        - メインダッシュボード

【ギャラリーページ】
gallery-ideas.html        - Ideasギャラリー
gallery-knowledge.html    - Knowledgeギャラリー
gallery-output.html       - Outputギャラリー
gallery-news.html         - Newsギャラリー

【詳細ページ】
detail-idea.html          - アイデア詳細ページ
detail-knowledge.html     - ナレッジ詳細ページ
detail-output.html        - アウトプット詳細ページ

【投稿ページ】
gallery-post.html         - 投稿フォーム（各カテゴリ対応）
```

---

## 2. カテゴリ定義

### 2.1 Ideas（アイデア）
- **目的**: 「こんなの作りたい」を共有し、チームでブラッシュアップ
- **アクセントカラー**: Yellow (#fab005) / Blue (#228be6)
- **ステータス**:
  - 検討中（黄色）
  - 開発中（緑色）
  - 完了（青色）
- **表示項目**: タイトル、説明、投稿者、いいね数、コメント数、タグ

### 2.2 Knowledge（ナレッジ）
- **目的**: すぐ使えるプロンプト集とAI活用のベストプラクティス
- **アクセントカラー**: Blue (#228be6)
- **カテゴリタグ**:
  - ライティング
  - コーディング
  - 画像生成
  - 分析
- **推奨ツールタグ**: Claude推奨、Cursor推奨、GPT-4o推奨、Midjourney等
- **表示項目**: タイトル、説明、プロンプトプレビュー、評価、コピー回数、投稿者

### 2.3 Output（アウトプット）
- **目的**: 完成したAIツール、GPTs、エージェントのショーケース
- **アクセントカラー**: Green (#12b886)
- **ツールタイプ**:
  - GPTs
  - Dify
  - Chrome拡張
  - Webツール
- **表示項目**: タイトル、説明、ツールタイプ、利用者数、投稿者、使うボタン

### 2.4 News（ニュース）
- **目的**: 最新のAIニュースをAI要約付きでキャッチアップ
- **アクセントカラー**: Orange (#fd7e14)
- **カテゴリタグ**:
  - 注目（Hot）
  - LLM
  - 画像生成
  - 業界動向
- **社内影響度**: 5段階（非常に高い〜低い）
- **表示項目**: タイトル、概要、AI要約、影響度、共有者、公開日時、外部リンク

---

## 3. UI/UX機能

### 3.1 テーマ切り替え
- **ライトモード**: Notion風の白を基調としたデザイン
- **ダークモード**: Discord風の黒を基調としたデザイン
- **切り替え方法**: ヘッダー右上のトグルボタン
- **永続化**: LocalStorageに保存（キー: `ai-hub-theme`）

### 3.2 ビュー切り替え
- **ギャラリービュー**: カード形式、画像が大きく表示（3カラムグリッド）
- **リストビュー**: コンパクトな横並びレイアウト（1カラム）
- **切り替え方法**: フィルターバー右側のアイコンボタン
- **永続化**: LocalStorageに保存（キー: `ai-hub-view`）

### 3.3 ヒーローセクション
- **背景**: Canvas APIによる動的ネットワークアニメーション
  - 点（ノード）が浮遊
  - 近い点同士が線で接続
  - マウス追従なしのシンプルなアニメーション
- **ライトモード**: 青系の淡いネットワーク（rgba(34, 139, 230, 0.4)）
- **ダークモード**: 紫系の光るネットワーク（rgba(139, 92, 246, 0.5)）
- **統計表示**: 各カテゴリの件数をリアルタイム表示

### 3.4 検索・フィルター機能
- **グローバル検索**: ⌘K ショートカット対応（予定）
- **カテゴリ別フィルター**: 各ページでステータス/タグ別にフィルタリング
- **ソート機能**: 新着順、人気順、コメント順など

### 3.5 カードデザイン
- **ギャラリーカード**:
  - 抽象的な画像（200px高）
  - タグバッジ
  - タイトル・説明
  - 投稿者アバター・名前
  - エンゲージメント指標（いいね、コメント等）
  - ホバーエフェクト（浮き上がり + シャドウ）
  - **クリックで詳細ページへ遷移**

- **リストカード**:
  - サムネイル画像（120x80px）
  - コンパクトな情報表示
  - 1行説明（line-clamp）
  - **クリックで詳細ページへ遷移**

### 3.6 ナビゲーション
- **ヘッダーナビ**: Ideas / Knowledge / Output / News へのリンク
- **カテゴリカード**: メインダッシュボードから各ギャラリーページへリンク
- **パンくずリスト**: 詳細ページに表示（ホーム > カテゴリ > タイトル）

---

## 4. 詳細ページ機能

### 4.1 Ideas詳細ページ（detail-idea.html）
- **ヒーロー画像**: 大きめのアイデア画像
- **メタ情報**: ステータス、タグ、投稿者、投稿日時
- **概要セクション**: 背景・課題、提案する解決策、期待される効果
- **コメントセクション**: コメント一覧と投稿フォーム
- **サイドバー**:
  - 「一緒に作りたい」ボタン
  - いいねボタン
  - ウォッチリスト追加ボタン
  - 統計情報（閲覧数、いいね、コメント、参加希望者数）
  - 関連するアイデア

### 4.2 Knowledge詳細ページ（detail-knowledge.html）
- **ヒーロー画像**: ナレッジ関連の抽象画像
- **メタ情報**: カテゴリタグ、ツールタグ、投稿者、投稿日時
- **コンテンツセクション**:
  - 概要説明
  - プロンプトテンプレート（コードブロック形式）
  - 使い方・例示
- **コメントセクション**: コメント一覧と投稿フォーム
- **サイドバー**:
  - 「プロンプトをコピー」ボタン
  - いいねボタン
  - ウォッチリスト追加ボタン
  - 統計情報（閲覧数、いいね、コメント、コピー数）
  - 関連するナレッジ

### 4.3 Output詳細ページ（detail-output.html）
- **ヒーロー画像**: ツールのスクリーンショット/デモ画像
- **メタ情報**: ツールタイプ、タグ、作成者、公開日時
- **デモセクション**: 
  - デモ動画/スクリーンショット表示エリア
  - ウィンドウフレーム風デザイン
- **概要セクション**:
  - 主な機能リスト
  - 技術スタック
  - 使い方手順
- **コメントセクション**: コメント一覧と投稿フォーム
- **サイドバー**:
  - 「ツールを使う」ボタン
  - 「GitHubで見る」ボタン
  - いいねボタン
  - ウォッチリスト追加ボタン
  - 統計情報（閲覧数、いいね、コメント、利用回数）
  - 関連するアウトプット

---

## 5. 投稿機能

### 5.1 投稿フォーム（gallery-post.html）
- **動的フォーム**: URLパラメータ（?type=idea/knowledge/output/news）で表示内容を変更
- **共通フィールド**:
  - タイトル（必須）
  - 内容（説明文）
  - Discord通知設定
- **送信処理**: 投稿完了後、対応するギャラリーページにリダイレクト

### 5.2 カテゴリ別フィールド

#### Ideas
- タグ選択: 業務効率化、マーケティング、コンテンツ、デザイン、カスタマーサポート、自動化
- 画像アップロード

#### Knowledge
- タグ選択: ライティング、コーディング、画像生成、分析
- プロンプトテンプレート入力
- プレビュー機能
- テスト実行機能（開発中）

#### Output
- タグ選択: GPTs、Dify、Chrome拡張、Webツール
- 画像アップロード
- ツールURL

#### News
- タグ選択: LLM、画像生成、業界動向
- 元記事URL
- AI要約（自動生成予定）
- 社内影響度設定

### 5.3 Discord連携設定
- 投稿時にDiscordに通知を送る
- コメントをDiscordと同期する

### 5.4 下書き機能
- 下書き保存ボタン
- LocalStorageまたはDBに保存

---

## 6. Discord連携機能（予定）

### 6.1 トリガーワード投稿
Discordで以下のトリガーワードを使うと自動でAI Hubに投稿:
- `#アイデア` → Ideasに投稿
- `#ナレッジ` → Knowledgeに投稿
- `#アウトプット` → Outputに投稿
- `#ニュース` → Newsに投稿

### 6.2 コメント同期
- AI Hub内のコメントをDiscordスレッドに同期
- Discordスレッドの返信をAI Hub内コメントに同期

### 6.3 通知機能
- 新規投稿時にDiscordチャンネルに通知
- メンション時にDM通知

---

## 7. 追加機能（予定）

### 7.1 AI セマンティック検索
- 自然言語での検索対応
- 関連コンテンツの自動推薦

### 7.2 パーソナライズ機能
- マイダッシュボード
- ウォッチリスト
- パーソナルフィード

### 7.3 コラボレーション機能
- 「一緒に作りたい」ボタン
- メンション機能
- リアルタイムコラボレーション

### 7.4 ナレッジ活用機能
- プロンプト即時実行
- フォーク/バージョン管理
- 効果測定トラッキング
- テンプレート変数入力

### 7.5 ゲーミフィケーション
- 貢献バッジ
- ランキング
- 月間MVP
- レベルシステム

### 7.6 ニュース機能
- RSS/API自動収集
- AI要約・タグ付け
- 週次ダイジェスト自動生成

### 7.7 管理・分析機能
- 利用状況ダッシュボード
- 人気コンテンツレポート

---

## 8. デザインシステム

### 8.1 カラーパレット

#### ライトモード
```css
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--bg-tertiary: #f1f3f5;
--bg-card: #ffffff;
--border-primary: #e9ecef;
--border-secondary: #dee2e6;
--text-primary: #212529;
--text-secondary: #495057;
--text-muted: #868e96;
```

#### ダークモード
```css
--bg-primary: #1a1b1e;
--bg-secondary: #25262b;
--bg-tertiary: #2c2e33;
--bg-card: #25262b;
--border-primary: #373a40;
--border-secondary: #495057;
--text-primary: #f8f9fa;
--text-secondary: #ced4da;
--text-muted: #868e96;
```

#### アクセントカラー
```css
--accent-blue: #228be6;    /* Ideas / Knowledge */
--accent-purple: #7950f2;  /* Knowledge */
--accent-green: #12b886;   /* Output */
--accent-orange: #fd7e14;  /* News */
--accent-red: #fa5252;     /* Alert/Hot */
--accent-yellow: #fab005;  /* Warning/検討中 */
--accent-cyan: #15aabf;    /* Info */
--accent-pink: #e64980;    /* 画像生成 */
```

### 8.2 タイポグラフィ
- **メインフォント**: Noto Sans JP
- **コードフォント**: JetBrains Mono
- **見出し**: Bold (700)
- **本文**: Regular (400)

### 8.3 スペーシング
- **カード間隔**: 24px (gap-6)
- **セクション間隔**: 64px (py-16)
- **カード内パディング**: 20-24px (p-5, p-6)

### 8.4 角丸
- **カード**: 16px (rounded-2xl)
- **ボタン**: 8px (rounded-lg)
- **タグ**: 4px (rounded)
- **アバター**: 完全な円 (rounded-full)

### 8.5 シャドウ
- **ライトモード**: rgba(0, 0, 0, 0.08)
- **ダークモード**: rgba(0, 0, 0, 0.3)

### 8.6 アニメーション
- **カードホバー**: translateY(-4px) + box-shadow増加
- **リストカードホバー**: translateY(-2px)
- **ネットワーク背景**: requestAnimationFrameによる60fps描画

---

## 9. データベース設計（予定）

### 9.1 テーブル構成

#### ideas
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| title | VARCHAR | タイトル |
| description | TEXT | 説明 |
| status | ENUM | 検討中/開発中/完了 |
| tags | ARRAY | タグ配列 |
| image_url | VARCHAR | 画像URL |
| user_id | UUID | 投稿者ID |
| likes_count | INT | いいね数 |
| comments_count | INT | コメント数 |
| discord_message_id | VARCHAR | Discord連携用 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### knowledge
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| title | VARCHAR | タイトル |
| description | TEXT | 説明 |
| prompt_template | TEXT | プロンプトテンプレート |
| category | ENUM | ライティング/コーディング/画像生成/分析 |
| recommended_tool | VARCHAR | 推奨ツール |
| tags | ARRAY | タグ配列 |
| rating | DECIMAL | 評価 |
| copy_count | INT | コピー数 |
| user_id | UUID | 投稿者ID |
| discord_message_id | VARCHAR | Discord連携用 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### outputs
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| title | VARCHAR | タイトル |
| description | TEXT | 説明 |
| tool_type | ENUM | GPTs/Dify/Chrome拡張/Webツール |
| tool_url | VARCHAR | ツールURL |
| image_url | VARCHAR | 画像URL |
| tags | ARRAY | タグ配列 |
| users_count | INT | 利用者数 |
| user_id | UUID | 投稿者ID |
| discord_message_id | VARCHAR | Discord連携用 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### news
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| title | VARCHAR | タイトル |
| description | TEXT | 説明 |
| ai_summary | TEXT | AI要約 |
| source_url | VARCHAR | 元記事URL |
| category | ENUM | LLM/画像生成/業界動向 |
| impact_level | INT | 社内影響度（1-5） |
| tags | ARRAY | タグ配列 |
| image_url | VARCHAR | 画像URL |
| user_id | UUID | 共有者ID |
| discord_message_id | VARCHAR | Discord連携用 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### users
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| name | VARCHAR | 表示名 |
| email | VARCHAR | メールアドレス |
| avatar_url | VARCHAR | アバター画像URL |
| discord_id | VARCHAR | Discord ID |
| created_at | TIMESTAMP | 作成日時 |

#### comments
| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| content | TEXT | コメント内容 |
| content_type | ENUM | idea/knowledge/output/news |
| content_id | UUID | 対象コンテンツID |
| user_id | UUID | 投稿者ID |
| discord_message_id | VARCHAR | Discord連携用 |
| created_at | TIMESTAMP | 作成日時 |

---

## 10. モックアップファイル一覧

```
ai-hub-mockup/
├── index-gallery.html        # メインダッシュボード
├── gallery-ideas.html        # Ideasギャラリー（ビュー切り替え対応）
├── gallery-knowledge.html    # Knowledgeギャラリー（ビュー切り替え対応）
├── gallery-output.html       # Outputギャラリー（ビュー切り替え対応）
├── gallery-news.html         # Newsギャラリー（ビュー切り替え対応）
├── detail-idea.html          # アイデア詳細ページ
├── detail-knowledge.html     # ナレッジ詳細ページ
├── detail-output.html        # アウトプット詳細ページ
├── gallery-post.html         # 投稿フォーム（動的カテゴリ対応）
└── SPECIFICATION.md          # 本仕様書
```

### 10.1 実装済み機能

- [x] メインダッシュボード（ギャラリービュー）
- [x] カテゴリ別ギャラリーページ（Ideas, Knowledge, Output, News）
- [x] ギャラリー/リストビュー切り替え
- [x] ダーク/ライトモード切り替え
- [x] 詳細ページ（Ideas, Knowledge, Output）
- [x] 投稿フォーム（全カテゴリ対応）
- [x] 動的ネットワーク背景アニメーション
- [x] 全ページ間のナビゲーションリンク
- [x] LocalStorageによるテーマ・ビュー設定の永続化

---

## 11. 今後の開発予定

### Phase 1: 基本機能実装
- [ ] Next.js + Supabaseでのバックエンド構築
- [ ] ユーザー認証（Supabase Auth）
- [ ] 基本CRUD操作
- [ ] 画像アップロード機能

### Phase 2: Discord連携
- [ ] Discord Bot開発
- [ ] トリガーワード投稿機能
- [ ] コメント同期機能
- [ ] 通知機能

### Phase 3: AI機能強化
- [ ] セマンティック検索
- [ ] ニュースのAI要約自動生成
- [ ] 関連コンテンツ推薦

### Phase 4: コラボレーション機能
- [ ] リアルタイムコラボレーション
- [ ] メンション・通知機能
- [ ] ゲーミフィケーション

---

*最終更新: 2026年1月9日*
