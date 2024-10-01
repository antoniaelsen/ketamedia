import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  build: {
    minify: false,
  },
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
  resolve: {
    alias: {
      components: "/src/components",
      store: "/src/store",
      util: "/src/util",
    },
  },
  plugins: [glsl(), react()],
});
