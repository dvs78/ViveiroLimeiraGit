import { catalogo } from "../assets/database/produtos.js";

import {
  renderizarCatalogo,
  containerCartoes,
} from "../src/components/cartaoProduto.js";
import { inicializarCarrinho } from "../src/components/menuCarrinho.js";

import { initRouter } from "./router.js";

// inicia o roteador ao carregar
initRouter();

// RENDERIZAR CATÁLOGO
renderizarCatalogo(catalogo, containerCartoes);

// INICIALIZAR CARRINHO
inicializarCarrinho();

// document.querySelector("a").addEventListener("click", (e) => {
//   e.preventDefault(); // evita recarregar
//   window.history.pushState({}, "", "/nova-rota");
//   // chame função que carrega o conteúdo dinamicamente
// });

document.getElementById("link-mudas").addEventListener("click", (e) => {
  e.preventDefault(); // impede o carregamento padrão

  // atualiza a URL
  window.history.pushState({}, "", "/mudas");

  // carrega dinamicamente o conteúdo de mudas.html
  carregarPagina("src/pages/mudas.html");
});

async function carregarPagina(caminho) {
  try {
    const response = await fetch(caminho);
    const html = await response.text();

    // insere o HTML em um elemento da página (ex: <main>)
    document.getElementById("conteudo-principal").innerHTML = html;
  } catch (erro) {
    console.error("Erro ao carregar a página:", erro);
    document.getElementById("conteudo-principal").innerHTML =
      "<p>Erro ao carregar conteúdo.</p>";
  }
}

window.addEventListener("popstate", () => {
  const caminho = window.location.pathname;

  if (caminho === "/mudas") {
    carregarPagina("src/pages/mudas.html");
  }
  // você pode expandir isso para outras rotas
});
