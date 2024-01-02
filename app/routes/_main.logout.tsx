import { type ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "../lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/auth/sign-in" });
}
