import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext", // para onde os arquivos serão exportados
  },
  base: "/", // ✅ garante que as rotas comecem na raiz
});

// export default defineConfig({
//   root: "front-end",
//   build: {
//     target: "esnext", // para onde os arquivos serão exportados
//     outDir: "../dist",
//     emptyOutDir: true,
//   },
//   server: {
//     port: 5173,
//   },
//   base: "/", // ✅ garante que as rotas comecem na raiz
// });
