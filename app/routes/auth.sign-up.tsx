import { useEffect } from "react";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react";
import {
  Anchor,
  Button,
  Fieldset,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { CreateUserSchema, createUser } from "../lib/user.server";
import { commonActionData } from "../utils";

export default function SignUp() {
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
      <Text ta="center">新規ユーザー登録</Text>
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
            登録
          </Button>
          <Anchor
            ta="center"
            renderRoot={(props) => <NavLink to="/auth/sign-in" {...props} />}
          >
            ログインはこちら
          </Anchor>
        </Stack>
      </Form>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formDataObj = Object.fromEntries(await request.formData());

  const validated = CreateUserSchema.safeParse(formDataObj);
  if (!validated.success) {
    return json({
      ...commonActionData,
      validationErrors: validated.error.flatten().fieldErrors,
    });
  }

  const result = await createUser(validated.data);
  if (result?.error) {
    return json({
      ...commonActionData,
      error: result.error,
    });
  }

  return redirect("/todos");
}
