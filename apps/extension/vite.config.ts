import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";

const isPro = process.env.VITE_PRO === "true";

export default defineConfig({
  define: {
    __PRO__: isPro,
  },
  plugins: [
    react(),
    webExtension({
      manifest: isPro ? "./manifest.pro.json" : "./manifest.json",
      additionalInputs: ["src/content/index.tsx"],
    }),
  ],
  build: {
    outDir: isPro ? "dist-pro" : "dist",
    emptyOutDir: true,
  },
});
