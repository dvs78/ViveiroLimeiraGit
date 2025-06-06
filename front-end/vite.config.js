import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext", // para onde os arquivos serão exportados
  },
});

// import { defineConfig } from 'vite';

// export default defineConfig({
//   root: 'front-end', // aponta para a pasta onde está o index.html
//   build: {
//     outDir: '../dist', // a saída será na raiz do projeto, fora do front-end
//     emptyOutDir: true, // limpa a pasta dist antes do build
//     target: "esnext", // para onde os arquivos serão exportados
//   },
//   server: {
//     port: 5173, // opcional: define a porta ao rodar `vite dev`
//   },
// });
