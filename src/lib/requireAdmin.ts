import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side guard for admin pages/route handlers. Proxy (middleware) does
 * an optimistic redirect for UX, but per Next.js's own auth guidance it
 * "should not be your only line of defense" — this re-checks against the
 * session on every request. Calling `auth()` here also forces the page to
 * render dynamically instead of being statically cached at build time,
 * which matters just as much: an admin page with no dynamic API call can
 * get frozen as static HTML from build time and silently stop reflecting
 * live data.
 */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

/** Same check for API route handlers, which should return 403 rather than redirect. */
export async function requireAdminApi() {
  const session = await auth();
  return session?.user.role === "ADMIN" ? session : null;
}
