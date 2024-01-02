import { Outlet } from "@remix-run/react";
import { Box, Card } from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "../lib/auth.server";
import { CommonErrorBoundary } from "../components/error-boundary";

export default function Auth() {
  return (
    <Box p="lg">
      <Card withBorder maw="450px" mx="auto">
        <Outlet />
      </Card>
    </Box>
  );
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/todos/incomplete",
  });
}
