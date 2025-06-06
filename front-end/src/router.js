const rotas = {
  "/": "src/pages/clientes.html", // rota padrão
  "/clientes": "src/pages/clientes.html",
  "/mudas": "src/pages/mudas.html",
  "/pedidos": "src/pages/pedidos.html",
};

export function initRouter() {
  // Intercepta todos os <a data-route>
  document.querySelectorAll("a[data-route]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const path = link.getAttribute("href");
      navegarPara(path);
    });
  });

  // Trata a navegação do botão voltar/avançar
  window.addEventListener("popstate", () => {
    carregarPagina(window.location.pathname);
  });

  // Carrega a página inicial
  carregarPagina(window.location.pathname);
}

function navegarPara(caminho) {
  window.history.pushState({}, "", caminho);
  carregarPagina(caminho);
}

async function carregarPagina(caminho) {
  const rota = rotas[caminho] || rotas["/"];

  try {
    const resposta = await fetch(rota);
    const html = await resposta.text();
    document.getElementById("conteudo-principal").innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar página:", err);
    document.getElementById("conteudo-principal").innerHTML =
      "<h2>Erro ao carregar a página</h2>";
  }
}
