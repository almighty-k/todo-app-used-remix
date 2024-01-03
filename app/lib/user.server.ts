import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import z from "zod";

import { prisma } from "./db.server";
import { ERROR_MESSAGES } from "../utils";

const SALT_ROUNDS = 10;

export const CreateUserSchema = z.object({
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

export async function createUser({
  name,
  password,
}: z.infer<typeof CreateUserSchema>) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "既に使用されているユーザー名です。",
      };
    }
    console.error(error);
    throw Error(ERROR_MESSAGES.unexpected);
  }
}
