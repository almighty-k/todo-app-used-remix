import { Tabs } from "@mantine/core";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useNavigate, useParams } from "@remix-run/react";

import { authenticator } from "../lib/auth.server";
import invariant from "tiny-invariant";
import { ERROR_MESSAGES } from "../utils";

export default function Todos() {
  const navigate = useNavigate();

  const { status } = useParams();
  invariant(status, ERROR_MESSAGES.invalidParam);

  return (
    <>
      <Tabs
        value={status}
        onChange={(newStatus) => navigate(newStatus || "incomplete")}
      >
        <Tabs.List>
          <Tabs.Tab value="incomplete">未了</Tabs.Tab>
          <Tabs.Tab value="inprogress">着手</Tabs.Tab>
          <Tabs.Tab value="complete">完了</Tabs.Tab>
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
