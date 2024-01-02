import { createCookieSessionStorage } from "@remix-run/node";

export const SUCCESS_MESSAGE_KEY = "successMessageKey";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"], // 本来は環境変数などで指定するが、サンプルアプリなので固定値を許容
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
