## 概要

- Remix を使用した Todo アプリのサンプル。

## 使用技術

- [Remix](https://remix.run/): React フレームワーク
- [remix-auth](https://github.com/sergiodxa/remix-auth): 認証
- [Mantine](https://mantine.dev/): Components ライブラリ
- [Zod](https://zod.dev/): バリデーション
- [Prisma](https://www.prisma.io/): ORM。なお、今回はフロント実装部分がメインのため、簡略な実装に留める

## 実装機能

- 認証。
- TODO の一覧表示・作成・編集・削除処理。
- 各種処理の成功時、エラーハンドリング時の通知実装。
- ブックマーク機能。楽観的更新を使用。

## 環境構築等

- 前提: node は v18.0.0 以上を使用
  ```bash
  $ npm i
  $ npx prisma migrate dev
  $ npm run dev
  ```
