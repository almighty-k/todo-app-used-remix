import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import {
  Text,
  Table,
  ActionIcon,
  TableTbody,
  Modal,
  Button,
  Stack,
} from "@mantine/core";
import invariant from "tiny-invariant";

import { authenticator } from "../lib/auth.server";
import { EditIcon, DeleteIcon } from "../components/icons";
import { TodoProgressBadge } from "../components/todos";
import { CenterLoader } from "../components/loader";
import { BookmarkButton } from "../components/button";
import { changeTodoBookmarked, deleteTodo, getTodos } from "../lib/todo.server";
import { ERROR_MESSAGES } from "../utils";
import {
  SUCCESS_MESSAGE_KEY,
  commitSession,
  getSession,
} from "../lib/session.server";
import { type UnwrapArray } from "../type";

export default function TodosByProgress() {
  const { todos } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  if (navigation.state === "loading")
    return (
      <>
        <CenterLoader />
        <Outlet />
      </>
    );

  if (!todos.length)
    return (
      <>
        <Text my="sm" size="sm" ta="center">
          該当するTODOはありません。
        </Text>
        <Outlet />
      </>
    );

  return (
    <>
      <Table>
        <TableTbody>
          {todos.map((todo) => (
            <TableRow key={todo.id} todo={todo} />
          ))}
        </TableTbody>
      </Table>

      <DeleteConfirmModal />
      <Outlet />
    </>
  );
}

interface TableRowProps {
  todo: UnwrapArray<SerializeFrom<typeof loader>["todos"]>;
}

function TableRow({ todo }: TableRowProps) {
  return (
    <Table.Tr>
      <Table.Td w="2rem" align="center">
        <BookmarkButton todoId={todo.id} todoBookmarked={todo.bookmarked} />
      </Table.Td>
      <Table.Td>{todo.title}</Table.Td>
      <Table.Td>
        <TodoProgressBadge
          progress={todo.progress as "incomplete" | "inprogress" | "complete"}
        />
      </Table.Td>
      <Table.Td w="3rem">
        <ActionIcon
          renderRoot={(props) => (
            <NavLink to={`${todo.id}/edit`} replace {...props} />
          )}
          variant="light"
        >
          <EditIcon />
        </ActionIcon>
      </Table.Td>
      <Table.Td w="3rem">
        {/* クエリパラメータを使用し、モーダル開閉を制御する */}
        <Form replace>
          <ActionIcon
            type="submit"
            name="deletedId"
            color="red"
            variant="light"
            value={todo.id}
          >
            <DeleteIcon />
          </ActionIcon>
          <input type="hidden" name="deletedTitle" defaultValue={todo.title} />
        </Form>
      </Table.Td>
    </Table.Tr>
  );
}

function DeleteConfirmModal() {
  const { progress } = useParams();
  invariant(progress, ERROR_MESSAGES.invalidParam);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const submitting = useNavigation().state === "submitting";

  return (
    <Modal
      opened={!!searchParams.get("deletedId")}
      onClose={() => navigate(`/todos/${progress}`, { replace: true })}
      title="削除確認"
    >
      <Stack
        renderRoot={(props) => <Form method="post" replace {...props} />}
        gap="sm"
      >
        <Text>
          {searchParams.get("deletedTitle")}を削除します。よろしいですか？
        </Text>
        <Button
          type="submit"
          name="intent"
          value="delete"
          ml="auto"
          color="red"
          disabled={submitting}
        >
          削除
        </Button>
      </Stack>
    </Modal>
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "delete": {
      const url = new URL(request.url);
      const deletedId = Number(url.searchParams.get("deletedId"));

      const deletedTodo = await deleteTodo({ id: deletedId });

      const session = await getSession(request.headers.get("Cookie"));
      session.flash(
        SUCCESS_MESSAGE_KEY,
        `${deletedTodo.title}を削除しました。`
      );

      return redirect(url.pathname, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
    case "bookmark": {
      const todoId = Number(formData.get("todoId"));
      const prevBookmarked = formData.get("bookmarked") === "true";

      return await changeTodoBookmarked({
        id: todoId,
        bookmarked: !prevBookmarked,
      });
    }
    default: {
      throw Error(ERROR_MESSAGES.unexpected);
    }
  }
}
