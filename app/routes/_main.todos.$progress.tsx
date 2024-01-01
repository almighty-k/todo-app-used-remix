import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { Text, Table, Rating, ActionIcon, TableTbody } from "@mantine/core";
import invariant from "tiny-invariant";

import { authenticator } from "../lib/auth.server";
import { EditIcon, DeleteIcon } from "../components/icons";
import { TodosProgressBadge } from "../components/todos";
import { CenterLoader } from "../components/loader";
import { getTodos } from "../lib/todo.server";
import { ERROR_MESSAGES } from "../utils";

export default function TodosByStatus() {
  const { todos } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  if (navigation.state === "loading") return <CenterLoader />;

  if (!todos.length)
    return (
      <Text my="sm" size="sm" ta="center">
        該当するTODOはありません。
      </Text>
    );

  return (
    <>
      <Table>
        <TableTbody>
          {todos.map((todo) => (
            <Table.Tr key={todo.id}>
              <Table.Td w="2rem">
                <Rating count={1} defaultValue={1} />
              </Table.Td>
              <Table.Td>{todo.title}</Table.Td>
              <Table.Td>
                <TodosProgressBadge
                  progress={
                    todo.progress as "incomplete" | "inprogress" | "complete"
                  }
                />
              </Table.Td>
              <Table.Td w="3rem">
                <ActionIcon variant="light">
                  <EditIcon />
                </ActionIcon>
              </Table.Td>
              <Table.Td w="3rem">
                <ActionIcon color="red" variant="light">
                  <DeleteIcon />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </TableTbody>
      </Table>

      <Outlet />
    </>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });

  const { progress } = params;
  invariant(progress, ERROR_MESSAGES.invalidParam);

  return json({
    todos: await getTodos({ userId: user.id, progress }),
  });
}
