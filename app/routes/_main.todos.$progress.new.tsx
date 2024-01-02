import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Button, Fieldset, Modal, Stack, TextInput } from "@mantine/core";
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";

import { authenticator } from "../lib/auth.server";
import { CreateTodoSchema, createTodo } from "../lib/todo.server";
import { commonActionData } from "../utils";
import {
  SUCCESS_MESSAGE_KEY,
  commitSession,
  getSession,
} from "../lib/session.server";

export default function TodosNew() {
  const actionData = useActionData<typeof action>();
  const validationErrors = actionData?.validationErrors;

  const location = useLocation();
  const prevPath = location.state
    ? location.state.prevPath
    : "/todos/incomplete";

  const navigate = useNavigate();
  const submitting = useNavigation().state === "submitting";

  return (
    <Modal
      opened
      onClose={() => navigate(prevPath, { replace: true })}
      title="作成"
    >
      <Form method="post" replace>
        <Stack
          renderRoot={(props) => (
            <Fieldset
              disabled={submitting}
              variant="unstyled"
              pb="sm"
              {...props}
            />
          )}
        >
          <TextInput
            name="title"
            label="タイトル"
            withAsterisk
            placeholder="タイトルを20文字以内で入力してください。"
            error={validationErrors?.title && validationErrors.title[0]}
          />
          <Button type="submit" fullWidth>
            作成
          </Button>
        </Stack>
      </Form>
    </Modal>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formDataObj = Object.fromEntries(await request.formData());
  const validated = CreateTodoSchema.safeParse(formDataObj);

  if (!validated.success) {
    return json({
      ...commonActionData,
      validationErrors: validated.error.flatten().fieldErrors,
    });
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });

  await createTodo({ userId: user.id, title: validated.data.title });

  const session = await getSession(request.headers.get("Cookie"));
  session.flash(SUCCESS_MESSAGE_KEY, `${validated.data.title}を作成しました。`);

  return redirect("/todos/incomplete", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
