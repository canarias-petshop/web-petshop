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
};

export default nextConfig;
