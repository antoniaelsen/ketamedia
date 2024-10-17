import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    minify: false,
  },
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
  resolve: {
    alias: {
      api: "/src/api",
      components: "/src/components",
      store: "/src/store",
      util: "/src/util",
    },
  },
  plugins: [glsl(), react()],
});
