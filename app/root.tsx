import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { useEffect } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";

import {
  SUCCESS_MESSAGE_KEY,
  commitSession,
  getSession,
} from "./lib/session.server";
import { CommonErrorBoundary } from "./components/error-boundary";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [{ title: "Todo App" }, { name: "description", content: "Todo App" }];
};

export default function App() {
  const { successMessage } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (successMessage) {
      notifications.show({
        title: successMessage,
        message: null,
      });
    }
  }, [successMessage]);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications position="top-right" />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const successMessage: string | null =
    session.get(SUCCESS_MESSAGE_KEY) || null;

  return json(
    { successMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
