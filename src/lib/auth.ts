import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Required for self-hosted deployments (Docker, reverse proxies) where the
  // incoming Host header may not exactly match NEXTAUTH_URL. Safe as long as
  // the app sits behind a proxy/load balancer you control (see docs/deployment.md).
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // Per-account throttle against credential stuffing / brute force.
        if (!rateLimit(`login:${email}`, { windowMs: 15 * 60 * 1000, max: 10 })) {
          console.warn(`[auth] rate limit hit for login attempts on ${email}`);
          return null;
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        await db.loginEvent.create({
          data: {
            userId: user.id,
            ip: getClientIp(request),
            userAgent: request.headers.get("user-agent") ?? undefined,
          },
        });

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
