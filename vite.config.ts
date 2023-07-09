import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { ViteRsw as rsw } from "vite-plugin-rsw";

export default defineConfig({
  build: {
    minify: false,
  },
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
  plugins: [glsl(), rsw(), react()],
});
