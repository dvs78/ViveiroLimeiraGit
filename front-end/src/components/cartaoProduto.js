import { buscarProducaoMudas } from "../../apiFront/reqMudas.js";
import { buscarPedidos } from "../../apiFront/reqPedidos.js";

import { adicionarAoCarrinho } from "./menuCarrinho.js";
import { criarSelect, formatarNumero } from "./funcoesDiversas.js";

// BUSCAR PRODUÇÃO DE MUDAS e MONTAR HTML
let producaoMudasBd = (await buscarProducaoMudas()) ?? [];
let pedidosBd = (await buscarPedidos()) ?? [];

// ORDENAR A LISTA
producaoMudasBd.sort((a, b) => {
  // Comparar por ano (convertido para número, se quiser numérica)
  if (a.ano !== b.ano) return a.ano.localeCompare(b.ano);

  // Se ano for igual, comparar cultivar
  if (a.cultivar !== b.cultivar) return a.cultivar.localeCompare(b.cultivar);

  // Se cultivar for igual, comparar semente
  return a.semente.localeCompare(b.semente);
});

// CRIAR FILTRO DE PESQUISA ANO
const selectFiltrarAno = document.getElementById("ano-select");

// Filtrando objetos únicos por ano
const listaUnicaAno = producaoMudasBd.filter(
  (objeto, indice, self) =>
    indice === self.findIndex((t) => t.ano === objeto.ano)
);
// Criando uma lista com anos únicos
const novaListaAno = listaUnicaAno.map((objeto, index) => ({
  id: index + 1, // Renomeando IDs a partir do número 1
  ano: objeto.ano,
}));

criarSelect(novaListaAno, selectFiltrarAno, "ano");

// CRIAR FILTRO DE PESQUISA CULTIVAR
const selectFiltrarCultivar = document.getElementById("cultivar-select");

// Filtrando objetos únicos por ano
const listaUnicaCultivar = producaoMudasBd.filter(
  (objeto, indice, self) =>
    indice === self.findIndex((t) => t.cultivar === objeto.cultivar)
);
// Criando uma lista com anos únicos
const novaListaCultivar = listaUnicaCultivar.map((objeto, index) => ({
  id: index + 1, // Renomeando IDs a partir do número 1
  cultivar: objeto.cultivar,
}));

criarSelect(novaListaCultivar, selectFiltrarCultivar, "cultivar");

// // CRIAR FILTRO DE PESQUISA SEMENTE
// const selectFiltrarSemente = document.getElementById("semente-select");

// // Filtrando objetos únicos por semente
// const listaUnicaSemente = producaoMudasBd.filter(
//   (objeto, indice, self) =>
//     indice === self.findIndex((t) => t.semente === objeto.semente)
// );
// // Criando uma lista com sementes únicas
// const novaListaSemente = listaUnicaSemente.map((objeto, index) => ({
//   id: index + 1, // Renomeando IDs a partir do número 1
//   semente: objeto.semente,
// }));

// criarSelect(novaListaSemente, selectFiltrarSemente, "semente");

// CRIAR FILTRO DE PESQUISA EMBALAGEM
const selectFiltrarEmbalagem = document.getElementById("embalagem-select");

// Filtrando objetos únicos por ano
const listaUnicaEmbalagem = producaoMudasBd.filter(
  (objeto, indice, self) =>
    indice === self.findIndex((t) => t.embalagem === objeto.embalagem)
);
// Criando uma lista com anos únicos
const novaListaEmbalagem = listaUnicaEmbalagem.map((objeto, index) => ({
  id: index + 1, // Renomeando IDs a partir do número 1
  embalagem: objeto.embalagem,
}));

criarSelect(novaListaEmbalagem, selectFiltrarEmbalagem, "embalagem");

let containerSelect = document.getElementById("container-cultivares-select");

// VISUALIZAR OS FILTROS
export function visualizarFiltros() {
  containerSelect.classList.remove("hidden");
  document.getElementById("header-index").classList.add("hidden");
}

const btnVisualizarFiltros = document.getElementById("icone-filtro");
btnVisualizarFiltros.addEventListener("click", visualizarFiltros);

export function FecharFiltros() {
  containerSelect.classList.add("hidden");
  document.getElementById("header-index").classList.remove("hidden");
}

const btnFecharFiltros = document.getElementById("icone-fechar-filtro");
btnFecharFiltros.addEventListener("click", FecharFiltros);

let listaFiltros = [
  selectFiltrarAno,
  selectFiltrarCultivar,
  selectFiltrarEmbalagem,
];

listaFiltros.forEach((select) => {
  select.addEventListener("change", filtrarLista);
});

let producaoTotal = 0;
// let peditoTotal = 0;
export let containerCartoes = document.getElementById("container-cartoes");
let containerNovosCartoes = document.getElementById("container-novos-cartoes");
// containerNovosCartoes.innerHTML = "";
export let novoCatalogo = producaoMudasBd ?? [];

async function filtrarLista() {
  containerNovosCartoes.innerHTML = "";
  containerCartoes.remove();
  containerNovosCartoes.classList.add("index-mudasbd");
  console.log(
    "selectFiltrarAno.value",
    selectFiltrarAno.value,
    "selectFiltrarCultivar",
    selectFiltrarCultivar.value,
    "selectFiltrarEmbalagem",
    selectFiltrarEmbalagem.value
  );

  producaoTotal = 0;
  novoCatalogo = [];
  let novaLista = producaoMudasBd;
  const ano = selectFiltrarAno.value;
  const cultivar = selectFiltrarCultivar.value;
  // const semente = selectFiltrarSemente.value;
  const embalagem = selectFiltrarEmbalagem.value;

  const filtrado = novaLista.filter((item) => {
    return (
      (!ano || item.ano === ano) &&
      (!cultivar || item.cultivar === cultivar) &&
      // (!semente || item.semente === semente) &&
      (!embalagem || item.embalagem === embalagem)
    );
  });
  // await exibirResultado(filtrado);
  filtrado.sort((a, b) => {
    // Comparar por ano (convertido para número, se quiser numérica)
    if (a.ano !== b.ano) return a.ano.localeCompare(b.ano);

    // Se ano for igual, comparar cultivar
    if (a.cultivar !== b.cultivar) return a.cultivar.localeCompare(b.cultivar);

    // Se cultivar for igual, comparar semente
    return a.semente.localeCompare(b.semente);
  });

  renderizarCatalogo(filtrado, containerNovosCartoes);
}

// SOMAR OS PEDIDOS PELO ID MUDA
function agruparPedidosPorIdMuda(lista) {
  const agrupado = lista.reduce((acc, item) => {
    const id = item.idmuda;

    const pedido = formatarNumero(item.pedido); // garante que é número

    if (!acc[id]) {
      acc[id] = { idmuda: id, pedido: 0 };
    }

    acc[id].pedido += pedido;
    return acc;
  }, {});

  return Object.values(agrupado); // retorna array de objetos
}
// agruparPedidosPorIdMuda(pedidosBd);
let listaAgrupada = agruparPedidosPorIdMuda(pedidosBd);
export async function renderizarCatalogo(lista, elemento) {
  elemento.innerHTML = "";

  let produtoTotal = 0;
  let pedidoTotal = 0;
  let estoqueTotal = 0;
  // let pedidoMuda = 0;

  for (const produtoCatalogo of await lista) {
    produtoCatalogo.pedido = 0;

    let acharPedido = listaAgrupada.find(
      (achar) => Number(achar.idmuda) === Number(produtoCatalogo.id)
    );
    // Se achar pedido for undefined , acharPedido.pedido : 0
    produtoCatalogo.pedido = acharPedido ? acharPedido.pedido : 0;
    let estoqueProduto = produtoCatalogo.producao - produtoCatalogo.pedido;

    const cartaoProduto = `
          <div class="card-produto" data-tipo=${produtoCatalogo.embalagem.toLowerCase()}>
            <p class="cultivar">${produtoCatalogo.cultivar}</p>

  <p class="embalagem">${produtoCatalogo.embalagem}</p>
            <p class="producao">Produção: ${Number(
              produtoCatalogo.producao
            ).toLocaleString("pt-BR")}</p>
            <p class="pedido">Pedido: ${Number(
              produtoCatalogo.pedido
            ).toLocaleString("pt-BR")} </p>
            <p class="estoque">Estoque: ${Number(estoqueProduto).toLocaleString(
              "pt-BR"
            )} </p>
            <button id="adicionar-${
              produtoCatalogo.id
            }" ><i class="fa-solid fa-cart-plus"></i></button>
          </div>`;
    elemento.innerHTML += cartaoProduto;
    produtoTotal += Number(produtoCatalogo.producao);
    pedidoTotal += Number(produtoCatalogo.pedido);
    estoqueTotal += estoqueProduto;
  }

  document.getElementById("container-produto-soma").innerHTML = `PRODUÇÃO:
        ${Number(produtoTotal).toLocaleString("pt-BR")}`;

  document.getElementById("container-produto-pedido").innerHTML = `PEDIDO:
        ${Number(pedidoTotal).toLocaleString("pt-BR")}`;

  document.getElementById("container-produto-estoque").innerHTML = `ESTOQUE:
        ${Number(estoqueTotal).toLocaleString("pt-BR")}`;
  for (const produtoCatalogo of lista) {
    document
      .getElementById(`adicionar-${produtoCatalogo.id}`)
      .addEventListener("click", () => {
        adicionarAoCarrinho(produtoCatalogo.id);
      });
  }
}
