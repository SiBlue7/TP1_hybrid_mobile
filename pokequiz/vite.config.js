import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [vue(), mode === "development" && vueDevTools()].filter(Boolean),
  build: { outDir: "mobile/www", emptyOutDir: true },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
}));
