import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error('Env variable BACKEND_URL not defined');
}

const nextConfig: NextConfig = {
  // Configure les rewrites pour rendre visible le cookie http only
  // lorsque le backend et le frontend sont sur 2 domaines différents
  // On utilise "/api" pour séparer les rewrites des routes normales de Next
  // afin d'éviter que les pages renvoient du rendu HTML au lieu des JSON API
  rewrites: async () => [
    {
      source: "/api/auth/:path*",
      destination: backendUrl + "/auth/:path*"
    }
  ]
};

export default nextConfig;
