import { z } from "zod";

import { prisma } from "./db.server";
import { ERROR_MESSAGES } from "../utils";

export async function getTodos({
  userId,
  progress,
}: {
  userId: number;
  progress: string;
}) {
  return await prisma.todo.findMany({
    where: {
      userId,
      progress,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getTodo({ id }: { id: number }) {
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });

  if (!todo) {
    throw new Error(ERROR_MESSAGES.unexpected);
  }
  return todo;
}

export const CreateTodoSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルは必須です。" })
    .max(20, { message: "タイトルは20文字以下で入力してください。" }),
});

export async function createTodo({
  userId,
  title,
}: { userId: number } & z.infer<typeof CreateTodoSchema>) {
  return await prisma.todo.create({
    data: {
      title,
      progress: "incomplete",
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export const UpdateTodoSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルは必須です。" })
    .max(20, { message: "タイトルは20文字以下で入力してください。" }),
  progress: z.enum(["incomplete", "inprogress", "complete"]),
});

export async function updateTodo({
  id,
  title,
  progress,
}: { id: number } & z.infer<typeof UpdateTodoSchema>) {
  return await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
      progress,
    },
  });
}

export async function deleteTodo({ id }: { id: number }) {
  return await prisma.todo.delete({
    where: {
      id,
    },
  });
}
