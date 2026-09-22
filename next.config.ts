import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` régénère sinon AGENTS.md/CLAUDE.md automatiquement (fichiers volontairement gitignorés ici).
  agentRules: false,
};

export default nextConfig;
