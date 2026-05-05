import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    storageState: "auth.json",   // Claude.ai session cookies
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { channel: "chromium" } },
  ],
});
