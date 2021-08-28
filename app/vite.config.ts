import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  server: { hmr: { host: "localhost", port: 3200 } }, // Using different port from the actual port bc docker-compose
  plugins: [reactRefresh()],
});
