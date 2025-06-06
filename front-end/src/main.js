import { catalogo } from "../assets/database/produtos.js";

import {
  renderizarCatalogo,
  containerCartoes,
} from "../src/components/cartaoProduto.js";
import { inicializarCarrinho } from "../src/components/menuCarrinho.js";

// RENDERIZAR CATÁLOGO
renderizarCatalogo(catalogo, containerCartoes);

// INICIALIZAR CARRINHO
inicializarCarrinho();

// document.querySelector("a").addEventListener("click", (e) => {
//   e.preventDefault(); // evita recarregar
//   window.history.pushState({}, "", "/nova-rota");
//   // chame função que carrega o conteúdo dinamicamente
// });

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (e) => {
    if (e.target.closest("a[data-link]")) {
      e.preventDefault();
      const link = e.target.closest("a");
      const path = link.getAttribute("href");
      history.pushState({}, "", path);
      await carregarPagina(path);
    }
  });

  // carregar a página correta ao recarregar ou navegar direto
  carregarPagina(location.pathname);
});

// função para carregar conteúdo dinamicamente
async function carregarPagina(path) {
  const main = document.querySelector("main");

  let arquivo = "";
  switch (path) {
    case "/mudas":
      arquivo = "./src/pages/mudas.html";
      break;
    case "/entregas":
      arquivo = "./src/pages/entregas.html";
      break;
    case "/pedidos":
      arquivo = "./src/pages/pedidos.html";
      break;
    case "/clientes":
      arquivo = "./src/pages/clientes.html";
      break;
    default:
      arquivo = "./src/pages/mudas.html"; // ou uma página 404
  }

  const resposta = await fetch(arquivo);
  const html = await resposta.text();
  main.innerHTML = html;
}
