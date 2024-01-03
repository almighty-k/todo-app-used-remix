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

https://github.com/almighty-k/todos-used-remix/assets/63405154/978e9057-7480-4439-9c74-ddc72cb6a445

https://github.com/almighty-k/todos-used-remix/assets/63405154/cd6faff6-805c-4bf3-9cc3-8309172b5811



## 環境構築等

- 前提: node は v18.0.0 以上を使用
  ```bash
  $ npm i
  $ npx prisma migrate dev
  $ npm run dev
  ```
