import { useEffect } from "react";
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import {
  Text,
  Stack,
  Fieldset,
  TextInput,
  Button,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

import {
  AUTH_STRATEGY_NAME,
  AuthSchema,
  authenticator,
} from "../lib/auth.server";
import { ERROR_MESSAGES, commonActionData } from "../utils";

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const validationErrors = actionData?.validationErrors;

  const submitting = useNavigation().state === "submitting";

  useEffect(() => {
    if (actionData?.error) {
      notifications.show({
        title: actionData.error,
        message: null,
        color: "red",
        autoClose: false,
      });
    }
  }, [actionData?.error]);

  return (
    <>
      <Text ta="center">ログイン</Text>
      <Form method="post">
        <Stack
          renderRoot={(props) => (
            <Fieldset disabled={submitting} variant="unstyled" {...props} />
          )}
          py="sm"
        >
          <TextInput
            name="name"
            label="ユーザー名"
            placeholder="半角英数4~20文字で入力してください。"
            withAsterisk
            error={validationErrors?.name && validationErrors.name[0]}
          />
          <TextInput
            name="password"
            type="password"
            label="パスワード"
            placeholder="半角英数記号8~20文字で入力してください。"
            withAsterisk
            error={validationErrors?.password && validationErrors.password[0]}
          />
          <Button type="submit" fullWidth>
            ログイン
          </Button>
          <Anchor
            ta="center"
            renderRoot={(props) => <NavLink to="/auth/sign-up" {...props} />}
          >
            新規登録はこちら
          </Anchor>
        </Stack>
      </Form>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/todos/incomplete",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  // requestはバリデーションと認証の両方で使用する。
  // その際、request.formData() を複数回呼び出すとエラーになるので、cloneすることで回避する。
  const cloneRequest = request.clone();
  const formDataObj = Object.fromEntries(await cloneRequest.formData());

  const validated = AuthSchema.safeParse(formDataObj);
  if (!validated.success) {
    return json({
      ...commonActionData,
      validationErrors: validated.error.flatten().fieldErrors,
    });
  }

  try {
    return await authenticator.authenticate(AUTH_STRATEGY_NAME, request, {
      successRedirect: "/todos/incomplete",
      throwOnError: true,
    });
  } catch (error) {
    // 認証が成功時にはResponseのインスタンスがerrorとして返ってきて、catch文に入る。
    // その場合はerrorを返すことで、redirect(successRedirect)処理が行われる。
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json({
        ...commonActionData,
        error: error.message,
      });
    }
    console.error(error);
    throw Error(ERROR_MESSAGES.unexpected);
  }
}
