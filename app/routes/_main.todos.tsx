import { Tabs } from "@mantine/core";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";

import { authenticator } from "../lib/auth.server";

export default function Todos() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
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
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
}
