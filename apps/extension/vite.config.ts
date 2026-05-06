import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";

const isPro = process.env.VITE_PRO === "true";
const isFF  = process.env.VITE_FF  === "true";

function getManifest(): string {
  if (isFF && isPro) return "./manifest.ff.pro.json";
  if (isPro)         return "./manifest.pro.json";
  return "./manifest.json";
}

function getOutDir(): string {
  if (isFF && isPro) return "dist-ff-pro";
  if (isPro)         return "dist-pro";
  return "dist";
}

export default defineConfig({
  define: {
    __PRO__: isPro,
  },
  plugins: [
    react(),
    webExtension({
      manifest: getManifest(),
      additionalInputs: ["src/content/index.tsx"],
    }),
  ],
  build: {
    outDir: getOutDir(),
    emptyOutDir: true,
  },
});
