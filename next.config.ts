import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller, self-contained production build for Docker (see Dockerfile).
  output: "standalone",
  // Prisma's generated client ships native/WASM query-engine assets that
  // shouldn't be bundled by webpack/turbopack — keep it as a real dependency.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
