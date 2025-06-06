import { buscarClientes } from "../../apiFront/reqClientes.js";
import { buscarCarrinho } from "../../apiFront/reqCarrinho.js";
import { buscarPedidos, salvarPedidos } from "../../apiFront/reqPedidos.js";

import {
  criarSelect,
  criarSelectMaiusculo,
  formatarCEP,
  formatarTelefone,
  capitalizePalavras,
  formatarCPF,
} from "../../src/components/funcoesDiversas.js";

let listaClientes = await buscarClientes();
let listaCarrinho = await buscarCarrinho();

// ORDENAR OS DADOS
listaClientes.sort((a, b) => a.nomecompleto.localeCompare(b.nomecompleto));
listaCarrinho.sort((a, b) => a.cultivar.localeCompare(b.cultivar));

// Excluir os nomes repetidos e mantém as outras colunas
let dadosClientes = Array.from(
  new Map(listaClientes.map((cliente) => [cliente.nome, cliente])).values()
);

// CRIAR SELECT DATA
const inputData = document.getElementById("data-input");
const hoje = new Date().toISOString().split("T")[0]; // pega "AAAA-MM-DD"
inputData.value = hoje;

// CRIAR SELECT CLIENTES
const selectClientes = document.getElementById("clientes-select-checkout");
criarSelectMaiusculo(dadosClientes, selectClientes, "nomecompleto");

// CRIAR SELECT INSCRIAÇÃO ESTADUAL
const selectInscricaoEstadual = document.getElementById(
  "inscricaoEstadual-select-checkout"
);
const containerProdutosCarrinho = document.getElementById(
  "produtos-carrinho-checkout"
);
const finalizarPedido = document.getElementById(
  "finalizar-pedido-div-checkout"
);
const btnFinalizarPedido = document.getElementById("btn-adi-pedido");

function preencherDadosCliente(cliente) {
  document.getElementById("checkout-cpf").value = formatarCPF(cliente.cpf);
  document.getElementById("checkout-telefone").value = formatarTelefone(
    cliente.telefone
  );
  document.getElementById("checkout-email").value = cliente.email;
  document.getElementById("checkout-endereco").value = `${capitalizePalavras(
    cliente.rua
  )}
${capitalizePalavras(cliente.bairro)}, ${formatarCEP(cliente.cep)}
${capitalizePalavras(cliente.cidade)} - ${cliente.estado.toUpperCase()}`;
}

async function criarSelectInscricaoEstadual() {
  selectInscricaoEstadual.innerHTML = "";
  const valorSelecionado =
    selectClientes.options[selectClientes.selectedIndex].text;

  let filtrarClientes = listaClientes.filter(
    (cliente) =>
      capitalizePalavras(cliente.nomecompleto) ===
      capitalizePalavras(valorSelecionado)
  );

  criarSelect(filtrarClientes, selectInscricaoEstadual, "inscricaoestadual");

  containerProdutosCarrinho.classList.remove("hidden");
  finalizarPedido.classList.remove("hidden");
  btnFinalizarPedido.classList.remove("hidden");

  let valorSelecionadoInscricaoEstadual =
    selectInscricaoEstadual.options[selectInscricaoEstadual.selectedIndex];

  filtrarClientes = listaClientes.filter(
    (cliente) =>
      cliente.inscricaoestadual ===
      String(valorSelecionadoInscricaoEstadual.value)
  );
  if (filtrarClientes.length > 0) {
    preencherDadosCliente(filtrarClientes[0]);
  }
}
selectClientes.addEventListener("change", criarSelectInscricaoEstadual);

// PREENCHER INPUTS COM OS DADOS DO CLIENTE SELECIONADO
selectInscricaoEstadual.addEventListener("change", async () => {
  containerProdutosCarrinho.classList.remove("hidden");
  finalizarPedido.classList.remove("hidden");
  btnFinalizarPedido.classList.remove("hidden");
  const valorSelecionado =
    selectInscricaoEstadual.options[selectInscricaoEstadual.selectedIndex];

  let filtrarClientes = listaClientes.filter(
    (cliente) => cliente.inscricaoestadual === String(valorSelecionado.value)
  );
  if (filtrarClientes.length > 0) {
    preencherDadosCliente(filtrarClientes[0]);
  }
});

// DADOS DO CARRINHO e FINALIZAR PEDIDO
let html = "";
for (const produto of listaCarrinho) {
  html += `
    <div class="container-produto-checkout">
      <span class="produto-checkout cultivar-checkout">${produto.cultivar}</span>
      <span class="produto-checkout cultivar-embalagem">${produto.embalagem}</span>
      <span class="produto-checkout ">R$_muda: ${produto.precomudadesconto}</span>
      <span class="produto-checkout ">Mudas total: R$ ${produto.pedido}</span>
      <span class="produto-checkout ">Valor total: R$ ${produto.precomudatotal}</span>
    </div>
  `;
}
containerProdutosCarrinho.innerHTML = html;

// RESUMO DO PRODUTO TOTAL
const somados = Object.values(
  listaCarrinho.reduce((acc, item) => {
    if (!acc[item.cultivar]) {
      acc[item.cultivar] = { cultivar: item.cultivar, pedido: 0 };
    }
    let valor = item.pedido.replace(/\D/g, "");
    acc[item.cultivar].pedido += Number(valor);
    return acc;
  }, {})
);

for (const produto of somados) {
  const containerProdutoTotal = `<span>${
    produto.cultivar
  }:  ${produto.pedido.toLocaleString()}</span>`;

  document.getElementById("checkout-produto-total").innerHTML +=
    containerProdutoTotal;
}

// RESUMO DAS EMBALAGENS TOTAL
const embalagensSomadas = Object.values(
  listaCarrinho.reduce((acc, item) => {
    if (!acc[item.embalagem]) {
      acc[item.embalagem] = { embalagem: item.embalagem, pedido: 0 };
    }
    let valor = item.pedido.replace(/\D/g, "");
    acc[item.embalagem].pedido += Number(valor);
    return acc;
  }, {})
);

for (const produto of embalagensSomadas) {
  const containerEmbalagemTotal = `<span>${
    produto.embalagem
  }:  ${produto.pedido.toLocaleString()}</span>`;

  document.getElementById("checkout-embalagem-total").innerHTML +=
    containerEmbalagemTotal;
}

// RESUMO DAS EMBALAGENS TOTAL
let produtoTotal = 0;
let produtoValorTotal = 0;
for (const produto of listaCarrinho) {
  let valor = produto.pedido.replace(/\D/g, "");
  produtoTotal += Number(valor);
  let valorTotal = produto.precomudatotal.replace(/\D/g, "");
  produtoValorTotal += Number(valorTotal);
}
const containerMudasTotal = `<span>Mudas: ${produtoTotal.toLocaleString()}</span>`;
document.getElementById("checkout-total").innerHTML = containerMudasTotal;

const containerValorTotal = `<span>Valor: ${produtoValorTotal.toLocaleString()}</span>`;
document.getElementById("checkout-valor-total").innerHTML = containerValorTotal;

btnFinalizarPedido.addEventListener("click", async () => {
  let listaObjetoFinalizarPedido = {};
  let objetoFinalizarPedido = {};

  objetoFinalizarPedido.data = inputData.value;
  objetoFinalizarPedido.nomecompleto = selectClientes.value;
  objetoFinalizarPedido.inscricaoestadual = selectInscricaoEstadual.value;

  // FILTRAR ID DO CLIENTE
  const clientesFiltrados = listaClientes.filter(
    (cliente) =>
      cliente.nomecompleto === selectClientes.value &&
      cliente.inscricaoestadual === selectInscricaoEstadual.value
  );

  objetoFinalizarPedido.idcliente = clientesFiltrados[0].id;

  for (const item of listaCarrinho) {
    listaObjetoFinalizarPedido = { ...objetoFinalizarPedido, ...item };
    console.log("listaObjetoFinalizarPedido", listaObjetoFinalizarPedido);
    salvarPedidos(
      listaObjetoFinalizarPedido.idcliente,
      Number(listaObjetoFinalizarPedido.id),
      listaObjetoFinalizarPedido.data,
      listaObjetoFinalizarPedido.precomuda,
      listaObjetoFinalizarPedido.desconto,
      listaObjetoFinalizarPedido.precomudadesconto,
      listaObjetoFinalizarPedido.pedido,
      listaObjetoFinalizarPedido.precomudatotal
    );
  }
  window.location.href = "pedidos.html";
});
