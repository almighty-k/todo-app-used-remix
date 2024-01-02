import { Text, AppShell, Burger, Button, Stack, Flex } from "@mantine/core";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, Outlet, useLocation } from "@remix-run/react";
import { useDisclosure } from "@mantine/hooks";

import { authenticator } from "../lib/auth.server";
import { TodosIcon, BookmarkIcon, LogoutIcon } from "../components/icons";

export default function Todos() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header px="sm">
        <Flex align="center" h="100%" gap="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="lg">Todoアプリ</Text>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack h="100%" justify="space-between">
          <NavLinks />

          {/* _main.tsxはルート扱いになり、actionを定義できない。 */}
          {/* そのため、_main.logout.tsxにログアウトのアクションを定義し、そのアクションを呼び出す。 */}
          <Form method="post" action="logout">
            <Button
              type="submit"
              variant="transparent"
              color="gray"
              justify="start"
              fullWidth
              leftSection={<LogoutIcon />}
            >
              ログアウト
            </Button>
          </Form>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

function NavLinks() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    {
      label: "todo一覧",
      to: "todos/incomplete",
      active: [
        "/todos/incomplete",
        "/todos/inprogress",
        "/todos/complete",
      ].some((path) => currentPath === path),
      icon: <TodosIcon />,
    },
    {
      label: "ブックマーク済み",
      to: "bookmarks",
      active: currentPath === "/bookmarks",
      icon: <BookmarkIcon />,
    },
  ];

  return (
    <div>
      {links.map((link) => (
        <Button
          key={link.to}
          justify="start"
          variant={link.active ? "light" : "transparent"}
          color={link.active ? "blue" : "gray"}
          leftSection={link.icon}
          renderRoot={(props) => <NavLink to={link.to} {...props} />}
          fullWidth
        >
          {link.label}
        </Button>
      ))}
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
}
