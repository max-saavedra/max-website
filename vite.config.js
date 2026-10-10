import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/max-website/", // Must match the GitHub repository name for Pages
  publicDir: 'public',
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});