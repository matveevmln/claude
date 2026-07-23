import { cookies } from "next/headers";
import type { Session } from "next-auth";

const COOKIE_NAME = "impersonate_target";

/**
 * Resolves which user's data the current request should act on.
 *
 * Security model: the cookie is only ever *written* by the admin-only
 * /api/admin/impersonate route, but cookies are still client-writable in
 * general — so we never trust the cookie value alone. It's only honored
 * when the REAL authenticated session (from the signed JWT, not the
 * cookie) has role === "ADMIN". A customer forging this cookie on
 * themselves gains nothing, because their own session role is CUSTOMER.
 */
export async function getEffectiveUserId(session: Session): Promise<{
  userId: string;
  isImpersonating: boolean;
}> {
  if (session.user.role === "ADMIN") {
    const store = await cookies();
    const target = store.get(COOKIE_NAME)?.value;
    if (target) return { userId: target, isImpersonating: true };
  }
  return { userId: session.user.id, isImpersonating: false };
}

export async function setImpersonationCookie(targetUserId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, targetUserId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour — must be re-initiated after that
  });
}

export async function clearImpersonationCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
