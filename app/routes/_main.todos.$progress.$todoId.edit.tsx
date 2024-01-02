import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Button,
  Fieldset,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import invariant from "tiny-invariant";

import { ERROR_MESSAGES } from "../utils";
import { authenticator } from "../lib/auth.server";
import { UpdateTodoSchema, getTodo, updateTodo } from "../lib/todo.server";

import {
  SUCCESS_MESSAGE_KEY,
  commitSession,
  getSession,
} from "../lib/session.server";

export default function TodosEdit() {
  const { progress } = useParams();
  invariant(progress, ERROR_MESSAGES.invalidParam);

  const { todo } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const validationErrors = actionData?.validationErrors;

  const navigate = useNavigate();
  const navigation = useNavigation();

  return (
    <Modal
      opened
      onClose={() => navigate(`/todos/${progress}`, { replace: true })}
      title="編集"
    >
      <Form method="post" replace>
        <Stack
          renderRoot={(props) => (
            <Fieldset
              disabled={navigation.state === "submitting"}
              variant="unstyled"
              {...props}
            />
          )}
          gap="sm"
        >
          <TextInput
            name="title"
            label="タイトル"
            withAsterisk
            placeholder="タイトルを20文字以内で入力してください。"
            defaultValue={todo.title}
            error={validationErrors?.title && validationErrors.title[0]}
          />
          <Select
            name="progress"
            label="進捗"
            withAsterisk
            placeholder="進捗を選択してください。"
            data={[
              { value: "incomplete", label: "未了" },
              { value: "inprogress", label: "着手" },
              { value: "complete", label: "完了" },
            ]}
            defaultValue={todo.progress}
          />
          <Button type="submit" ml="auto">
            編集
          </Button>
        </Stack>
      </Form>
    </Modal>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });

  const { todoId } = params;
  invariant(todoId, ERROR_MESSAGES.invalidParam);

  return json({
    todo: await getTodo({ id: Number(todoId) }),
  });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { todoId } = params;
  invariant(todoId, ERROR_MESSAGES.invalidParam);

  const formDataObj = Object.fromEntries(await request.formData());
  const validated = UpdateTodoSchema.safeParse(formDataObj);

  if (!validated.success) {
    return json({
      validationErrors: validated.error.flatten().fieldErrors,
    });
  }

  const updatedTodo = await updateTodo({
    id: Number(todoId),
    ...validated.data,
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.flash(SUCCESS_MESSAGE_KEY, `${updatedTodo.title}を編集しました。`);

  return redirect(`/todos/${updatedTodo.progress}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
