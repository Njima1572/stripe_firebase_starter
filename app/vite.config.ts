import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: { hmr: { host: "localhost", port: 3200 } }, // Using different port from the actual port bc docker-compose
  plugins: [vue()],
});
