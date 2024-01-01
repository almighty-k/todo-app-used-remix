import { Text, Flex, Tabs, ActionIcon, Stack } from "@mantine/core";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLocation, useNavigate } from "@remix-run/react";

import { authenticator } from "../lib/auth.server";
import { CreateIcon } from "../components/icons";

export default function Todos() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack gap="xs">
      <Flex align="center" gap="sm">
        <Text>Todo一覧</Text>
        <ActionIcon
          variant="light"
          renderRoot={(props) => (
            <NavLink
              to={`${location.pathname}/new`}
              {...props}
              state={{ prevPath: location.pathname }}
              replace
            />
          )}
        >
          <CreateIcon />
        </ActionIcon>
      </Flex>

      <Tabs
        value={location.pathname}
        onChange={(newProgress) => navigate(newProgress || "/todos/incomplete")}
      >
        <Tabs.List>
          <Tabs.Tab value="/todos/incomplete">未了</Tabs.Tab>
          <Tabs.Tab value="/todos/inprogress">着手</Tabs.Tab>
          <Tabs.Tab value="/todos/complete">完了</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Outlet />
    </Stack>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
}
