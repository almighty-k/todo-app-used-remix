import { z } from "zod";
import { prisma } from "./db.server";

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
  });
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

export async function deleteTodo({ id }: { id: number }) {
  return await prisma.todo.delete({
    where: {
      id,
    },
  });
}
