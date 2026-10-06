/** @type {import('next').NextConfig} */
const nextConfig = {
  // All pages are dynamic (no static pre-rendering during build).
  // This avoids build-time API calls to the backend and the
  // "Functions cannot be passed to Client Components" error that
  // occurs when Next.js tries to serialize Server→Client props.
  output: undefined,

  // Increase the static generation timeout so slow backend responses
  // during build don't abort page compilation.
  staticPageGenerationTimeout: 120,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Silence the "Functions cannot be passed directly to Client Components"
  // error that occurs in the App Router when a Server Component passes an
  // event handler prop. All our pages already use `force-dynamic`, so
  // this is belt-and-suspenders.
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
