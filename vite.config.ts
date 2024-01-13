import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  publicDir: "public",
  base: mode === "production" ? "./" : "",
  server: {
    host: true,
    port: 5000,
  },
  build: {
    rollupOptions: { output: { dir: "./build" } },
    minify: true,
  },
  resolve: {
    alias: {
      // "@public": resolve(__dirname, './public'),
    },
  },
}));
