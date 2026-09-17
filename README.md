# ToDoアプリ (Next.js App Router版)

Next.js の App Router で作成したシンプルな ToDo アプリです。データはサーバーに送らず、ブラウザの `localStorage` に保存します。

## 機能

- タスクの追加・削除
- 完了/未完了のトグル
- フィルタ表示（すべて / 未完了 / 完了済み）
- 完了済みタスクの一括削除
- ブラウザの `localStorage` へのデータ永続化（リロードしても消えない）

## 使用技術

- [Next.js](https://nextjs.org/) (App Router)
- React / TypeScript
- Tailwind CSS

## 起動方法

```bash
npm install
npm run dev
```

`http://localhost:3000` を開くとアプリが表示されます。

## その他のコマンド

```bash
npm run build   # 本番用ビルド
npm run start   # 本番用ビルドの起動
npm run lint    # ESLint によるチェック
```

## ディレクトリ構成（主要ファイル）

```
app/
  layout.tsx            # ルートレイアウト
  page.tsx              # トップページ（サーバーコンポーネント）
  components/
    TodoApp.tsx          # ToDoアプリ本体（クライアントコンポーネント）
```
