import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  plugins: [react(), legacy()],
});
