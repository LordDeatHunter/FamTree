import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import eslint from "vite-plugin-eslint";
import basicSsl from '@vitejs/plugin-basic-ssl';
// import fs from "fs";
// import path from "path";

export default defineConfig({
  plugins: [eslint(), solidPlugin(), basicSsl()],
  base: "./",
  build: {
    target: "esnext",
  },
  server: {
    port: 3000,
    // https: {
    //   key: fs.readFileSync(path.join(__dirname, "/.cert/key.pem")),
    //   cert: fs.readFileSync(path.join(__dirname, "/.cert/cert.pem")),
    // },
    proxy: {
      "/api": {
        target: "https://localhost:5001/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
