import { defineConfig, splitVendorChunkPlugin } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          hyglike_data: [
            "/src/Visualizer/Scenes/Aster/hyglike_from_athyg_24.json",
          ],
        },
      },
    },
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
  plugins: [glsl(), react(), splitVendorChunkPlugin()],
});
