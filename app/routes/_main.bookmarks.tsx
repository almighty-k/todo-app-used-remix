import { Outlet } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Stack, Text } from "@mantine/core";

import { authenticator } from "../lib/auth.server";
import { CommonErrorBoundary } from "../components/error-boundary";

export default function Bookmarks() {
  return (
    <Stack gap="xs">
      <Text>ブックマーク済み</Text>
      <Outlet />
    </Stack>
  );
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
}
