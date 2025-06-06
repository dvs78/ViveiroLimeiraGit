import { buscarClientes } from "../../apiFront/reqClientes.js";
import { buscarProducaoMudas } from "../../apiFront/reqMudas.js";
import {
  buscarPedidos,
  editarPedidos,
  deletarPedido,
} from "../../apiFront/reqPedidos.js";

import {
  criarSelect,
  criarSelectMaiusculo,
  capitalizePalavras,
  formatarNumero,
} from "../../src/components/funcoesDiversas.js";

// FUNÇÃO ORDENAR PEDIDOS
function ordenarlistaPedidos(lista) {
  lista.sort((a, b) => {
    // Comparar por ano (convertido para número, se quiser numérica)
    if (a.ano !== b.ano) return a.ano.localeCompare(b.ano);

    // Se ano for igual, comparar nomecompleto
    if (a.nomecompleto !== b.nomecompleto)
      return a.nomecompleto.localeCompare(b.nomecompleto);

    // Se nomecompleto for igual, comparar cultivar
    if (a.cultivar !== b.cultivar) return a.cultivar.localeCompare(b.cultivar);

    // Última ordenação
    return a.embalagem.localeCompare(b.embalagem);
  });
  return lista;
}

// CRIAR LISTA DE PEDIDODS COMPLETA
let clientesBd = (await buscarClientes()) ?? [];
let mudasBd = (await buscarProducaoMudas()) ?? [];
let pedidosBd = (await buscarPedidos()) ?? [];

function ajustarCliente(pedido, clientes) {
  return clientes.filter((f) => Number(f.id) === Number(pedido.idcliente));
}
function ajustarMuda(pedido, mudas) {
  return mudas.filter((f) => Number(f.id) === Number(pedido.idmuda));
}

async function criarlistaPedidos() {
  let pedidos = [];
  for (const pedido of pedidosBd) {
    let cliente = ajustarCliente(pedido, clientesBd);
    pedido.ano = pedido.data.slice(0, 4);
    pedido.nomecompleto = cliente[0].nomecompleto;
    pedido.inscricaoestadual = cliente[0].inscricaoestadual;

    let mudas = ajustarMuda(pedido, mudasBd);
    pedido.cultivar = mudas[0].cultivar;
    pedido.semente = mudas[0].semente;
    pedido.embalagem = mudas[0].embalagem;
    pedidos.push(pedido);
  }
  pedidos = ordenarlistaPedidos(pedidos);
  return pedidos;
}
let listaPedidos = await criarlistaPedidos();

// CRIAR FUNÇÃO PARA LISTA ÚNICA
function criarListaUnica(lista, chave) {
  const listaUnica = lista.filter(
    (objeto, indice, self) =>
      indice === self.findIndex((t) => t[chave] === objeto[chave])
  );
  return listaUnica.map((objeto, index) => ({
    id: index + 1,
    [chave]: objeto[chave],
  }));
}

// CRIAR FILTRO DE PESQUISA ANO
const selectFiltrarAno = document.getElementById("ano-select-pedidos");
const novaListaAno = criarListaUnica(listaPedidos, "ano");
criarSelect(novaListaAno, selectFiltrarAno, "ano");

// CRIAR FILTRO DE PESQUISA NOME COMPLETO
const selectFiltrarNomeCompleto = document.getElementById(
  "nome-completo-select-pedidos"
);
const novaListaNomeCompleto = criarListaUnica(listaPedidos, "nomecompleto");
criarSelectMaiusculo(
  novaListaNomeCompleto,
  selectFiltrarNomeCompleto,
  "nomecompleto"
);

// CRIAR FILTRO DE PESQUISA CULTIVAR
const selectFiltrarCultivar = document.getElementById(
  "cultivar-select-pedidos"
);
const novaListaCultivar = criarListaUnica(listaPedidos, "cultivar");
criarSelect(novaListaCultivar, selectFiltrarCultivar, "cultivar");

// CRIAR FILTRO DE PESQUISA SEMENTE
const selectFiltrarSemente = document.getElementById("semente-select-pedidos");
const novaListaSemente = criarListaUnica(listaPedidos, "semente");
criarSelect(novaListaSemente, selectFiltrarSemente, "semente");

// CRIAR FILTRO DE PESQUISA EMBALAGEM
const selectFiltrarEmbalagem = document.getElementById(
  "embalagem-select-pedidos"
);
const novaListaEmbalagem = criarListaUnica(listaPedidos, "embalagem");
criarSelect(novaListaEmbalagem, selectFiltrarEmbalagem, "embalagem");

// VISUALIZAR OS FILTROS
function visualizarFiltros() {
  document.getElementById("filtros-pedidos").classList.remove("hidden");
  document.getElementById("header-pedidos").classList.add("hidden");
}

const btnVisualizarFiltros = document.getElementById(
  "icone-filtro-pedidos-cadastrados"
);
btnVisualizarFiltros.addEventListener("click", visualizarFiltros);

function FecharFiltros() {
  document.getElementById("filtros-pedidos").classList.add("hidden");
  document.getElementById("header-pedidos").classList.remove("hidden");
}
const btnFecharFiltros = document.getElementById(
  "icone-fechar-filtro-pedidos-cadastrados"
);
btnFecharFiltros.addEventListener("click", FecharFiltros);

let listaFiltros = [
  selectFiltrarAno,
  selectFiltrarNomeCompleto,
  selectFiltrarCultivar,
  selectFiltrarSemente,
  selectFiltrarEmbalagem,
];

listaFiltros.forEach((select) => {
  select.addEventListener("change", filtrarLista);
});

let producaoTotal = 0; // O que fazer com isso
let valorTotal = 0;

let containerPedidosBd = document.getElementById("pedidos-pedidosbd");
// let novoContainerPedidosBd = document.getElementById("pedidos-novos-pedidosbd");

async function filtrarLista() {
  producaoTotal = 0;

  const ano = selectFiltrarAno.value;
  const nomeCompleto = selectFiltrarNomeCompleto.value;
  const cultivar = selectFiltrarCultivar.value;
  const semente = selectFiltrarSemente.value;
  const embalagem = selectFiltrarEmbalagem.value;

  const filtrado = listaPedidos.filter((item) => {
    return (
      (!ano || item.ano === ano) &&
      (!nomeCompleto || item.nomecompleto === nomeCompleto) &&
      (!cultivar || item.cultivar === cultivar) &&
      (!semente || item.semente === semente) &&
      (!embalagem || item.embalagem === embalagem)
    );
  });

  renderizarCard(filtrado);
}

let pegarId = [];

function cartaoCultivar(objeto) {
  let qtde = formatarNumero(objeto.pedido);
  let valor = Number(objeto.precomudadesconto);
  let valorTotal = Number(qtde * valor);

  let cartaoCultivarBd = `
 
    <p id="nome-completo-card${
      objeto.id
    }" class="nome-completo-card">${capitalizePalavras(
    objeto.nomecompleto
  )} </p>
    <p id="ano-card${objeto.id}" class="ano-card">${objeto.ano} </p>
    <p id="cultivar-card${objeto.id}" class="cultivar-card">${
    objeto.cultivar
  } </p>
    <p id="semente-card${objeto.id}">${objeto.semente}</p>
    <p id="embalagem-card${objeto.id}">${objeto.embalagem}</p>
    <p id="precomudadesconto-card${objeto.id}">R$_muda: ${
    objeto.precomudadesconto
  }</p>
    <p id="pedido-card${objeto.id}">Mudas total: ${objeto.pedido}</p>

    <p id="precomudatotal-card${
      objeto.id
    }">Valor total: ${valorTotal.toLocaleString("pt-BR")}</p>

    <div id="${objeto.id}" class="pedidos-card-btn">
      <button id="pedidos-btn-edi-atu-pedidos${
        objeto.id
      }" class="pedidos-btn-edi-pedidos">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button id="pedidos-btn-exc-pedidos${
        objeto.id
      }" class="pedidos-btn-exc-pedidos">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>

  `;
  return cartaoCultivarBd;
}

// INPUTS
const inputAno = document.getElementById("ano-input");
const inputNomeCompleto = document.getElementById("nome-completo-input");
const inputCultivar = document.getElementById("cultivar-input");
const inputSemente = document.getElementById("semente-input");
const inputEmbalagem = document.getElementById("embalagem-input");
const inputPedido = document.getElementById("pedido-input");

async function criarCartaoCultivar(pedidoObjeto, elemento) {
  let container = elemento;
  const elementoArticle = document.createElement("article"); // <article></article>
  elementoArticle.id = `card-nome-completo-pedidos${pedidoObjeto.id}`;
  elementoArticle.classList.add("pedidos-pedidosbd-div");

  elementoArticle.innerHTML = cartaoCultivar(pedidoObjeto);
  container.appendChild(elementoArticle);

  document
    .getElementById(`pedidos-btn-exc-pedidos${pedidoObjeto.id}`)
    .addEventListener("click", async () => {
      document
        .getElementById(`card-nome-completo-pedidos${pedidoObjeto.id}`)
        .classList.remove("pedidos-pedidosbd-div");
      document
        .getElementById(`card-nome-completo-pedidos${pedidoObjeto.id}`)
        .classList.add("pedidos-pedidosbd-div-selecionado");

      await deletarPedido(pedidoObjeto);
      location.reload();
    });

  document
    .getElementById(`pedidos-btn-edi-atu-pedidos${pedidoObjeto.id}`)
    .addEventListener("click", () => {
      if (pegarId.length > 0) {
        // filtrar[0].nomeCompleto = capitalizePalavras(filtrar[0].nomeCompleto);
        renderizarCard(listaPedidos);
      }
      document
        .getElementById(`card-nome-completo-pedidos${pedidoObjeto.id}`)
        .classList.remove("pedidos-pedidosbd-div");
      document
        .getElementById(`card-nome-completo-pedidos${pedidoObjeto.id}`)
        .classList.add("pedidos-pedidosbd-div-selecionado");
      pegarId = [];
      pegarId.push(pedidoObjeto.id);

      inputAno.value = pedidoObjeto.ano;
      inputNomeCompleto.value = capitalizePalavras(pedidoObjeto.nomecompleto);
      inputCultivar.value = pedidoObjeto.cultivar;
      inputSemente.value = pedidoObjeto.semente;
      inputEmbalagem.value = pedidoObjeto.embalagem;
      inputPedido.value = pedidoObjeto.pedido;

      document
        .getElementById("pedidos-btn-edi-pedidos")
        .classList.remove("hidden");

      document
        .getElementById("pedidos-btn-add-pedidos")
        .classList.add("hidden");
    });
}

inputPedido.addEventListener("input", () => {
  let valor = formatarNumero(inputPedido.value);
  valor = Number(valor).toLocaleString("pt-BR"); // formata com ponto de milhar
  inputPedido.value = valor;
});

// EDITAR PEDIDOS
document
  .getElementById("pedidos-btn-edi-pedidos")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    // let pedidosBd = await listaPedidos;
    let filtrar = listaPedidos.filter((f) => f.id === Number(pegarId[0]));
    filtrar[0].pedido = inputPedido.value;

    let qtde = formatarNumero(inputPedido.value);
    qtde = qtde;
    let valor = Number(filtrar[0].precomudadesconto);
    valor = valor;
    let valorTotal = Number(qtde * valor);
    filtrar[0].precomudatotal = valorTotal.toLocaleString("pt-BR");

    // document.getElementById("precomudadesconto-card${objeto.id}")
    console.log(
      document.getElementById(`precomudatotal-card${pegarId[0]}`).textContent,
      " só alterar onde altera a qtde da muda"
    );

    // console.log("filtrar", filtrar);
    await editarPedidos(filtrar[0]);
    document.getElementById("pedidos-form-pedidosbd").reset();
    // document.getElementById("pedidos-pedidosbd").innerHTML = "";
    await renderizarCard(listaPedidos);
  });

async function renderizarCard(lista) {
  // document.getElementById("pedidos-pedidosbd").innerHTML = "";
  // producaoTotal = 0;
  // valorTotal = 0;
  resetarCards();
  for (const item of lista) {
    criarCartaoCultivar(item, containerPedidosBd);
    let qtde = formatarNumero(item.pedido);
    producaoTotal += qtde;
    let valor = Number(item.precomudadesconto);
    valorTotal += valor * qtde;
    document.getElementById(
      "producao-pedidos-cadastrados"
    ).innerHTML = `${producaoTotal.toLocaleString(
      "pt-BR"
    )} mudas no valor total: R$ ${valorTotal.toLocaleString("pt-BR")}`;
  }
}

renderizarCard(listaPedidos);

function resetarCards() {
  document.getElementById("pedidos-pedidosbd").innerHTML = "";
  producaoTotal = 0;
  valorTotal = 0;
}
