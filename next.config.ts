import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for small, cache-friendly Docker images.
  output: "standalone",
  // Typed <Link href> and router helpers — catches broken routes at build time.
  typedRoutes: true,
  // Fail the production build on type errors instead of shipping them.
  // (Next 16 runs ESLint separately — see the `lint` script / CI.)
  typescript: { ignoreBuildErrors: false },
  images: {
    // Add remote hosts here as features need them; kept empty by default.
    remotePatterns: [],
  },
  experimental: {
    // Keep server-only packages out of the client/edge bundle.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
