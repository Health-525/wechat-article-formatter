import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy, rarely-changing vendor libraries into their own chunks so
    // they cache independently from app code across deploys.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return
          if (id.includes("katex")) return "katex"
          if (id.includes("marked")) return "marked"
          if (id.includes("lucide-react")) return "lucide"
          if (id.includes("react") || id.includes("scheduler")) return "react-vendor"
          return "vendor"
        },
      },
    },
  },
});
