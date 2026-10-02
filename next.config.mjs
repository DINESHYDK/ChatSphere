/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add any other backend or storage domains here (e.g., AWS S3, your API server)
      // {
      //   protocol: 'https',
      //   hostname: 'your-custom-domain.com',
      // },
    ],
  },
};

export default nextConfig;