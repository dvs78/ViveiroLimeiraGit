import { buscarPedidos } from "../../apiFront/reqPedidos.js";
import { buscarClientes } from "../../apiFront/reqClientes.js";
import { buscarProducaoMudas } from "../../apiFront/reqMudas.js";
import {
  buscarEntregas,
  salvarEntregas,
  excluirEntrega,
  editarEntregas,
} from "../../apiFront/reqEntregas.js";

import {
  criarSelect,
  criarSelectMaiusculo,
  capitalizePalavras,
  formatarParaLocaleString,
  mostrarMensagem,
  validarCampos,
  formatarNumero,
  preencherSelectPorValor,
} from "../../src/components/funcoesDiversas.js";

// BUSCAR BANCO DE DADOS
let listaPedidos = (await buscarPedidos()) ?? [];
let listaClientes = (await buscarClientes()) ?? [];
let listaMudas = (await buscarProducaoMudas()) ?? [];
let listaEntregas = (await buscarEntregas()) ?? [];

// DOM
/// Inputs e Selects
const inputData = document.getElementById("input-data");
const selectClientes = document.getElementById("select-clientes");
const selectInscricaoEstadual = document.getElementById(
  "select-inscrição-estadual"
);
const selectCultivar = document.getElementById("select-cultivar");
const selectSemente = document.getElementById("select-semente");
const selectEmbalagem = document.getElementById("select-embalagem");
const inputVeiculo = document.getElementById("tipo-veiculo");
const inputMotorista = document.getElementById("motorista");
const inputEntrega = document.getElementById("entrega");
const inputQtdePessoas = document.getElementById("qtde-pessoas");
const btnAddEntrega = document.getElementById("btn-adicionar-entrega");
const btnEdiEntrega = document.getElementById("btn-editar-entrega");
const formEntregas = document.getElementById("form-entregas");

//// Selects filtros
const filtroAno = document.getElementById("ano-select-entregas");
const filtroNome = document.getElementById("nome-completo-select-entregas");
const filtroCultivar = document.getElementById("cultivar-select-entregas");
const filtroSemente = document.getElementById("semente-select-entregas");
const filtroEmbalagem = document.getElementById("embalagem-select-entregas");

// VISUALIZAR OS FILTROS
function visualizarFiltros() {
  document.getElementById("filtros-entregas").classList.remove("hidden");
  document.getElementById("header-entregas").classList.add("hidden");
}

const btnVisualizarFiltros = document.getElementById(
  "icone-filtro-historico-entregas"
);
btnVisualizarFiltros.addEventListener("click", visualizarFiltros);

function FecharFiltros() {
  document.getElementById("filtros-entregas").classList.add("hidden");
  document.getElementById("header-entregas").classList.remove("hidden");
}
const btnFecharFiltros = document.getElementById(
  "icone-fechar-filtro-entregas-cadastrados"
);
btnFecharFiltros.addEventListener("click", FecharFiltros);

// FUNÇÕES AUXILIARES
function ajustarCliente(pedido, clientes) {
  return clientes.find((f) => Number(f.id) === Number(pedido.idcliente));
}

function ajustarMuda(pedido, mudas) {
  return mudas.find((f) => Number(f.id) === Number(pedido.idmuda));
}

function agruparEntregasPorMudaComDados(lista) {
  const agrupado = new Map();

  lista.forEach((item) => {
    const id = item.idpedido;
    const entrega = Number(String(item.entrega).replace(/\./g, "")) || 0;

    if (agrupado.has(id)) {
      agrupado.get(id).entrega += entrega;
    } else {
      // Cria cópia do objeto base com entrega convertida
      agrupado.set(id, { ...item, entrega });
    }
  });

  return Array.from(agrupado.values());
}

function ajustarEntrega(pedido, entregas) {
  return entregas.filter(
    (f) =>
      Number(f.idcliente) === Number(pedido.idcliente) &&
      Number(f.idmuda) === Number(pedido.idmuda)
  );
}

// FUNÇÃO CRIAR LISTA DE PEDIDOS COMPLETA
async function criarlistaPedidosEEntregas() {
  let pedidos = [];

  for (const pedido of await listaPedidos) {
    const cliente = ajustarCliente(pedido, listaClientes);
    const muda = ajustarMuda(pedido, listaMudas);
    const entregaAgrupada = agruparEntregasPorMudaComDados(listaEntregas);
    const entrega = ajustarEntrega(pedido, entregaAgrupada);

    // Ignora pedidos com dados incompletos
    if (!cliente || !muda || !pedido.data) {
      console.warn("Pedido ignorado: dados incompletos", pedido);
      continue;
    }

    const pedidoNum = Number(String(pedido.pedido).replace(/\./g, "")) || 0;
    let entregaNum = entrega[0]?.entrega || 0;
    entregaNum = Number(String(entregaNum).replace(/\./g, "")) || 0;
    let faltaEntregarNum = Number(pedidoNum) - Number(entregaNum);

    // Cria um novo objeto sem mutar o original
    const novoPedido = {
      ...pedido,
      idpedido: pedido.id,
      ano: pedido.data.slice(0, 4),
      nomecompleto: cliente.nomecompleto,
      inscricaoestadual: cliente.inscricaoestadual,
      cultivar: muda.cultivar,
      semente: muda.semente,
      embalagem: muda.embalagem,
      entrega: (entrega[0]?.entrega || 0).toLocaleString("pt-BR"),
      faltaentregar: faltaEntregarNum.toLocaleString("pt-BR"),
    };

    novoPedido.faltaentregar = faltaEntregarNum.toLocaleString("pt-BR");
    pedidos.push(novoPedido);
  }

  // Ordena os pedidos
  pedidos.sort((a, b) => {
    if (a.ano !== b.ano) return a.ano.localeCompare(b.ano);
    if (a.nomecompleto !== b.nomecompleto)
      return a.nomecompleto.localeCompare(b.nomecompleto);
    if (a.inscricaoestadual !== b.inscricaoestadual)
      return a.inscricaoestadual.localeCompare(b.inscricaoestadual);
    if (a.cultivar !== b.cultivar) return a.cultivar.localeCompare(b.cultivar);
    return a.embalagem.localeCompare(b.embalagem);
  });

  return pedidos;
}

// CRIAR TABELA COM LISTA DE PEDIDOS COMPLETA
function renderizarTabelaPedidos(lista) {
  const container = document.getElementById("tabela-pedidos");
  container.innerHTML = ""; // limpa antes de montar a tabela

  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhum pedido encontrado.</p>";
    return;
  }

  // let novaLista =
  // let faltaentregar = lista[0].pedido;
  const tabela = document.createElement("table");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>PEDIDO</th>
        <th>ANO</th>
        <th>CLIENTE</th>
        <th>INSCRIÇÃO</th>
        <th>CULTIVAR</th>
        <th>SEMENTE</th>
        <th>EMBALAGEM</th>
        <th>PEDIDOS</th>
        <th>ENTREGAS</th>
        <th>FALTA ENTREGAR</th>
        </tr>
        </thead>
        <tbody>
        ${lista
          .map(
            (p) => `
            
            <tr id="id-pedido-${p.id}">
            <td>${p.id}</td>
            <td>${p.ano}</td>
            <td>${capitalizePalavras(p.nomecompleto)}</td>
            <td>${p.inscricaoestadual || "-"}</td>
            <td>${p.cultivar}</td>
            <td>${p.semente}</td>
            <td>${p.embalagem}</td>
            <td>${p.pedido || 0}</td>
            <td>${p.entrega || 0}</td>
            <td>${p.faltaentregar || 0}</td>
            </tr>
            `
          )
          .join("")}
          </tbody>
          `;

  // <th>VISUALIZAR</th>
  // <td class="lupa"><i class="fa-solid fa-magnifying-glass"></i></td>
  container.appendChild(tabela);
}

// OBTER LISTA COMPLETA DE PEDIDOS
let listaPedidosEEntregas = await criarlistaPedidosEEntregas();
renderizarTabelaPedidos(listaPedidosEEntregas);

// CRIAR OS FILTROS
// criarSelect(filtroNome)
criarSelect(listaPedidosEEntregas, filtroAno, "ano");
criarSelectMaiusculo(listaPedidosEEntregas, filtroNome, "nomecompleto");
criarSelect(listaPedidosEEntregas, filtroCultivar, "cultivar");
criarSelect(listaPedidosEEntregas, filtroSemente, "semente");
criarSelect(listaPedidosEEntregas, filtroEmbalagem, "embalagem");

// FUNÇÃO DOS FILTROS
function filtrarPedidos() {
  const ano = filtroAno.value;
  const nome = filtroNome.value;
  const cultivar = filtroCultivar.value;
  const semente = filtroSemente.value;
  const embalagem = filtroEmbalagem.value;

  const pedidosFiltrados = listaPedidosEEntregas.filter((p) => {
    return (
      (ano === "" || p.ano === ano) &&
      (nome === "" || p.nomecompleto === nome) &&
      (cultivar === "" || p.cultivar === cultivar) &&
      (semente === "" || p.semente === semente) &&
      (embalagem === "" || p.embalagem === embalagem)
    );
  });
  renderizarTabelaPedidos(pedidosFiltrados);
}

// ASSOCIAR OS FILTROS AO EVENTO CHANGE
const filtros = [
  filtroAno,
  filtroNome,
  filtroCultivar,
  filtroSemente,
  filtroEmbalagem,
];

filtros.forEach((filtro) => {
  if (filtro) {
    filtro.addEventListener("change", filtrarPedidos);
  }
});

// INPUT DE DATA - VALOR PADRÃO: HOJE
const hoje = new Date().toISOString().split("T")[0];
inputData.value = hoje;

// CRIAR SELECTS
let idCliente = [];

criarSelectMaiusculo(listaPedidosEEntregas, selectClientes, "nomecompleto");
selectClientes.addEventListener("change", () => {
  const clienteSelecionado = selectClientes.value;

  // Limpar selects dependentes
  selectInscricaoEstadual.innerHTML = "<option value=''>Selecionar</option>";
  selectCultivar.innerHTML = "<option value=''>Selecionar</option>";
  selectSemente.innerHTML = "<option value=''>Selecionar</option>";
  selectEmbalagem.innerHTML = "<option value=''>Selecionar</option>";

  // Filtrar os pedidos do cliente selecionado
  const listaFiltrada = listaPedidosEEntregas.filter(
    (item) => item.nomecompleto === clienteSelecionado
  );

  idCliente = [listaFiltrada[0]?.idcliente]; // Se existir

  // Preencher inscrição estadual
  criarSelect(listaFiltrada, selectInscricaoEstadual, "inscricaoestadual");
});

selectInscricaoEstadual.addEventListener("click", () => {
  if (!selectClientes.value) {
    mostrarMensagem("Selecione o cliente", "#ff4a47");
  }
});

// Pegar id muda
// let idMuda = [];
selectInscricaoEstadual.addEventListener("change", () => {
  const inscricaoestadualSelecionada = selectInscricaoEstadual.value;
  const listaFiltrada = listaPedidosEEntregas.filter(
    (item) => item.inscricaoestadual === inscricaoestadualSelecionada
  );

  criarSelect(listaFiltrada, selectCultivar, "cultivar");
  criarSelect(listaFiltrada, selectSemente, "semente");
  criarSelect(listaFiltrada, selectEmbalagem, "embalagem");
});

// FUNÇÃO PARA GARANTIR A SELEÇÃO DA INSCRIÇÃO ESTADUAL
function selecionarSelect() {
  [selectCultivar, selectSemente, selectEmbalagem].forEach((select) => {
    if (!selectClientes.value || !selectInscricaoEstadual.value) {
      mostrarMensagem("Selecione o cliente e inscrição estadual", "#ff4a47");
      return;
    }
  });
}
[selectCultivar, selectSemente, selectEmbalagem].forEach((select) => {
  select.addEventListener("click", selecionarSelect);
});
formatarParaLocaleString(inputEntrega);

let entregasCadastradas = [];
let idPedidoClicado = [];
// CRIAR UMA NOVA ENTREGA
btnAddEntrega.addEventListener("click", async () => {
  idPedidoClicado = [];
  const data = inputData.value;
  const veiculo = inputVeiculo.value.trim();
  const motorista = inputMotorista.value.trim();
  const entrega = inputEntrega.value;
  const qtdepessoas = inputQtdePessoas.value;

  // validarCampo(inputData);
  const camposObrigatorios = [
    inputData,
    selectClientes,
    selectInscricaoEstadual,
    selectCultivar,
    selectSemente,
    selectEmbalagem,
    inputVeiculo,
    inputMotorista,
    inputEntrega,
    inputQtdePessoas,
  ];

  if (!validarCampos(camposObrigatorios)) {
    mostrarMensagem("Preencha todos os campos obrigatórios!", "#ff4a47");
    return;
  }

  // ACHAR A LISTA DE PEDIDOS COMPLETA
  listaPedidosEEntregas = await criarlistaPedidosEEntregas();
  console.log("listaPedidosEEntregas", listaPedidosEEntregas);
  const acharPedido = listaPedidosEEntregas.find(
    (item) =>
      item.nomecompleto.trim().toLowerCase() ===
        selectClientes.value.trim().toLowerCase() &&
      item.inscricaoestadual.replace(/\D/g, "") ===
        selectInscricaoEstadual.value.replace(/\D/g, "") &&
      item.cultivar === selectCultivar.value &&
      item.semente === selectSemente.value &&
      item.embalagem === selectEmbalagem.value
  );

  const pedido = Number(acharPedido.pedido.replace(/\./g, ""));
  const entreguaLista = Number((acharPedido.entrega || "0").replace(/\./g, ""));
  const entregaInput = Number(entrega.replace(/\./g, ""));
  const somaTotal = entreguaLista + entregaInput;
  if (somaTotal > pedido) {
    mostrarMensagem("A entrega ultrapassa o valor do pedido!", "#ff4a47");
    return;
  }

  const novaEntrega = {
    data,
    idpedido: acharPedido.idpedido,
    idcliente: acharPedido.idcliente,
    idmuda: acharPedido.idmuda,
    veiculo,
    motorista,
    entrega,
    qtdepessoas,
  };

  entregasCadastradas.push(novaEntrega);
  mostrarMensagem("Entrega cadastrada com sucesso!");
  inputVeiculo.value = "";
  inputMotorista.value = "";
  inputEntrega.value = "";
  inputQtdePessoas.value = "";
  await salvarEntregas(novaEntrega);
  // Recarregar entregas do banco
  listaEntregas = await buscarEntregas();

  // Recriar lista de pedidos completos com as entregas atualizadas
  listaPedidosEEntregas = await criarlistaPedidosEEntregas();

  // Re-renderizar tabela com os dados atualizados
  renderizarTabelaPedidos(listaPedidosEEntregas);

  let listaFiltrada = listaEntregas.filter(
    (f) => Number(f.idpedido) === Number(acharPedido.idpedido)
  );
  await renderizarTabelaEntregas(listaFiltrada);
});

// PEGAR ID DA TABELA ENTREGAS
// let listaEntregasFiltrada = [];
const tabelaPedidos = document.getElementById("tabela-pedidos");
// let listaEntregaSelecionada;
tabelaPedidos.addEventListener("click", async function (event) {
  const linha = event.target.closest("tr");

  // Ignora clique no cabeçalho
  if (!linha || linha.parentElement.tagName === "THEAD") return;

  const id = linha.cells[0].textContent; // A coluna 0 é a "ID"
  idPedidoClicado.push(id);
  let lista = await buscarEntregas();
  let listaEntregasFiltrada = lista.filter(
    (f) => Number(f.idpedido) === Number(id)
  );

  renderizarTabelaEntregas(listaEntregasFiltrada);
});

// Evento para destacar a linha clicada
tabelaPedidos.querySelectorAll("tbody tr").forEach((linha) => {
  linha.addEventListener("click", function () {
    // Remover classe de qualquer linha previamente selecionada
    tabelaPedidos
      .querySelectorAll("tbody tr")
      .forEach((tr) => tr.classList.remove("linha-selecionada"));

    // Adicionar a classe somente à linha clicada
    this.classList.add("linha-selecionada");
  });
});

async function renderizarTabelaEntregas(lista) {
  const container = document.getElementById("tabela-entregas");
  container.innerHTML = "";

  if (!lista || lista.length === 0) {
    container.innerHTML = "<p>Nenhuma entrega cadastrada.</p>";
    return;
  }
  container.innerHTML = `  
  <div style="text-align: center; margin: 2rem;"
            id="icone-fechar-entregas"
            class="historico-entregas-titulo"
          >
            <i class="fa-solid fa-filter"></i>
            <p>ENTREGAS CADASTRADAS</p>
          </div>`;

  // container.innerHTML = "ENTREGAS CADASTRADAS";
  const tabela = document.createElement("table");
  tabela.id = "tabela-entregas";

  tabela.innerHTML = `        
    <thead>
      <tr>
        <th>DATA</th>
        <th>CLIENTE</th>
        <th>CULTIVAR</th>
        <th>SEMENTE</th>
        <th>EMBALAGEM</th>
        <th>ENTREGA</th>
        <th>VEÍCULO</th>
        <th>MOTORISTA</th>
        <th>PESSOAS</th>
        <th>AÇÕES</th>
      </tr>
    </thead>
    <tbody>
      ${lista
        .map((e) => {
          const muda = listaMudas.find((m) => m.id === e.idmuda);
          const cliente = listaClientes.find((c) => c.id === e.idcliente);
          return `
          <tr id="pedido-linha-entrega-${e.id}">
            <td>${e.data}</td>
            <td>${capitalizePalavras(
              cliente?.nomecompleto || "Desconhecido"
            )}</td>
            <td>${muda?.cultivar || "-"}</td>
            <td>${muda?.semente || "-"}</td>
            <td>${muda?.embalagem || "-"}</td>
            <td>${e.entrega}</td>
            <td>${e.veiculo}</td>
            <td>${e.motorista}</td>
            <td>${e.qtdepessoas}</td>
             <td>
              <button class="btn-editar-entrega" data-id="${
                e.id
              }"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="btn-excluir-entrega" data-id="${
                e.id
              }"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>`;
        })
        .join("")}
    </tbody>
  `;
  // Evento para destacar a linha clicada
  tabela.querySelectorAll("tbody tr").forEach((linha) => {
    linha.addEventListener("click", function () {
      // Remover classe de qualquer linha previamente selecionada
      tabela
        .querySelectorAll("tbody tr")
        .forEach((tr) => tr.classList.remove("linha-selecionada"));

      // Adicionar a classe somente à linha clicada
      this.classList.add("linha-selecionada");
    });
  });

  container.appendChild(tabela);

  // Adicionar eventos aos botões após criar a tabela
  container.querySelectorAll(".btn-editar-entrega").forEach((btn) => {
    btn.addEventListener("click", () => editarEntrega(btn.dataset.id));
  });

  container.querySelectorAll(".btn-excluir-entrega").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await excluirEntrega(listaEntregas, btn.dataset.id);

      // Recarregar entregas do banco
      listaEntregas = await buscarEntregas();

      // Recriar lista de pedidos completos com as entregas atualizadas
      listaPedidosEEntregas = await criarlistaPedidosEEntregas();
      document.getElementById("tabela-entregas").innerHTML = "";
      // Re-renderizar tabela com os dados atualizados
      renderizarTabelaPedidos(listaPedidosEEntregas);
      let listaFiltrada = listaEntregas.filter(
        (f) => Number(f.idpedido) === Number(idPedidoClicado)
      );
      await renderizarTabelaEntregas(listaFiltrada);
    });
  });
}

let pegarValoresEditar = [];
async function editarEntrega(id) {
  const entrega = listaEntregas.find((e) => Number(e.id) === Number(id));
  if (!entrega) return;

  // Encontrar cliente pelo id
  const acharCliente = listaClientes.find((f) => f.id === entrega.idcliente);
  if (!acharCliente) {
    console.warn("Cliente não encontrado na lista.");
    return;
  }

  inputData.value = entrega.data;

  // Preencher select cliente e inscrição estadual
  await preencherSelectPorValor(selectClientes, acharCliente.nomecompleto);
  await preencherSelectPorValor(
    selectInscricaoEstadual,
    acharCliente.inscricaoestadual
  );

  // Encontrar muda pelo id
  const acharMuda = listaMudas.find((f) => f.id === entrega.idmuda);
  if (!acharMuda) {
    console.warn("Muda não encontrada na lista.");
    return;
  }

  // Preencher os demais selects com base nos dados da lista
  selectCultivar.value = acharMuda.cultivar;
  selectSemente.value = acharMuda.semente;
  selectEmbalagem.value = acharMuda.embalagem;

  // Inputs restantes
  inputVeiculo.value = entrega.veiculo;
  inputMotorista.value = entrega.motorista;
  inputEntrega.value = formatarNumero(entrega.entrega).toLocaleString("pt-BR");
  inputQtdePessoas.value = entrega.qtdepessoas;

  // BLOQUEAR SELECT e INPUT
  inputData.disabled = true;
  selectClientes.disabled = true;
  selectInscricaoEstadual.disabled = true;
  selectCultivar.disabled = true;
  selectSemente.disabled = true;
  selectEmbalagem.disabled = true;

  mostrarMensagem("Edição carregada. Altere os campos e clique em salvar.");
  btnEdiEntrega.classList.remove("hidden");
  btnAddEntrega.classList.add("hidden");

  pegarValoresEditar = [];
  const editarEntrega = {
    id: entrega.id,
    idcliente: entrega.idcliente,
    idmuda: entrega.idmuda,
    idpedido: entrega.idpedido,
    data: entrega.data,
    veiculo: entrega.veiculo,
    motorista: entrega.motorista,
    entrega: entrega.entrega,
    qtdepessoas: entrega.qtdepessoas,
  };
  pegarValoresEditar.push(editarEntrega);
}

btnEdiEntrega.addEventListener("click", async () => {
  pegarValoresEditar[0].veiculo = inputVeiculo.value;
  pegarValoresEditar[0].motorista = inputMotorista.value;
  pegarValoresEditar[0].entrega = inputEntrega.value;
  pegarValoresEditar[0].qtdepessoas = inputQtdePessoas.value;
  console.log("pegarValoresEditar", pegarValoresEditar[0]);
  await editarEntregas(pegarValoresEditar[0]);

  // DESBLOQUEAR SELECT e INPUT
  inputData.disabled = false;
  selectClientes.disabled = false;
  selectInscricaoEstadual.disabled = false;
  selectCultivar.disabled = false;
  selectSemente.disabled = false;
  selectEmbalagem.disabled = false;

  // OCULTAR BTN EDITAR e VISUALIZAR BTN CAD
  btnEdiEntrega.classList.remove("hidden");
  btnAddEntrega.classList.add("hidden");

  // Resetar formulário
  formEntregas.reset();

  // Recarregar entregas do banco
  listaEntregas = await buscarEntregas();

  // Recriar lista de pedidos completos com as entregas atualizadas
  listaPedidosEEntregas = await criarlistaPedidosEEntregas();
  document.getElementById("tabela-entregas").innerHTML = "";
  // Re-renderizar tabela com os dados atualizados
  renderizarTabelaPedidos(listaPedidosEEntregas);
  let listaFiltrada = listaEntregas.filter(
    (f) => Number(f.idpedido) === Number(idPedidoClicado)
  );
  await renderizarTabelaEntregas(listaFiltrada);
});
