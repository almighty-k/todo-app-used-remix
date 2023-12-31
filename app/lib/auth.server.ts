import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcrypt";
import { z } from "zod";

import { sessionStorage } from "./session.server";
import { prisma } from "./db.server";

export const AUTH_STRATEGY_NAME = "user-path";

interface User {
  id: number;
}

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const name = String(form.get("name"));
    const password = String(form.get("password"));
    const userId = await login({ name, password });

    return {
      id: userId,
    };
  }),
  AUTH_STRATEGY_NAME
);

export const AuthSchema = z.object({
  name: z
    .string()
    .min(4, { message: "4文字以上で入力してください。" })
    .max(20, { message: "20文字以下で入力してください。" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "半角英数で入力してください。" }),
  password: z
    .string()
    .min(8, { message: "8文字以上で入力してください。" })
    .max(20, { message: "20文字以下で入力してください。" })
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, {
      message: "半角英数記号で入力してください。",
    }),
});

async function login({ name, password }: z.infer<typeof AuthSchema>) {
  const user = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Error(
      "ログインに失敗しました。アカウント名とパスワードを再度ご確認ください。"
    );
  }

  return user.id;
}
