import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/sobre-nosotros',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tienda-online',
        destination: '/catalogo',
        permanent: true,
      },
      {
        source: '/tienda-online-de-mascotas',
        destination: '/catalogo',
        permanent: true,
      },
      {
        source: '/tu-tienda-local',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tienda',
        destination: '/catalogo',
        permanent: true,
      },
      {
        source: '/peluqueria',
        destination: '/',
        permanent: true,
      },
      {
        source: '/alimentacion',
        destination: '/catalogo',
        permanent: true,
      }
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
