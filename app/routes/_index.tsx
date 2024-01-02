import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "../lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/sign-in",
  });
  return redirect("/todos/incomplete");
}
