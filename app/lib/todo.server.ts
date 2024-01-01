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
