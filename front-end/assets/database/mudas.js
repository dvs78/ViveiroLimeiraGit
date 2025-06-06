import {
  cadastrarMudas,
  buscarProducaoMudas,
  editarProducaoMudasBd,
  deletarProducaoMudas,
} from "../../apiFront/reqMudas.js";

import { criarSelect } from "../../src/components/funcoesDiversas.js";

let containerCultivarBd = document.getElementById("mudas-mudasbd");
let producaoTotal = 0;
// SELECT ANOS
const anos = [
  { id: 1, ano: "2025" },
  { id: 2, ano: "2026" },
  { id: 3, ano: "2027" },
  { id: 4, ano: "2028" },
  { id: 5, ano: "2029" },
];

const selectYear = document.getElementById("ano-select");
criarSelect(anos, selectYear, "ano");

// SELECT SEMENTES
const seeds = [
  { id: 1, seed: "Câmara fria" },
  { id: 2, seed: "Semente do ano" },
];

const selectSeeds = document.getElementById("semente-select");
criarSelect(seeds, selectSeeds, "seed");

// SELECT EMBALAGENS
const embalagens = [
  { id: 1, embalagem: "Paper pot" },
  { id: 2, embalagem: "Saquinho 10 x 20" },
  { id: 3, embalagem: "Tubete 180 mL" },
  { id: 4, embalagem: "Tubete 290 mL" },
];

const selectPackagings = document.getElementById("embalagem-select");
criarSelect(embalagens, selectPackagings, "embalagem");

// SELECIONAR CULTIVAR
const cultivares = [
  { id: 1, cultivar: "Arara" },
  { id: 2, cultivar: "Catuaí 62" },
  { id: 3, cultivar: "Catucaí 24/137" },
  { id: 4, cultivar: "Mundo novo" },
  { id: 5, cultivar: "Paraíso 2" },
];

const selectCultivares = document.getElementById("cultivar-select");
criarSelect(cultivares, selectCultivares, "cultivar");

// BUSCAR PRODUÇÃO DE MUDAS e MONTAR HTML
let producaoMudasBd = (await buscarProducaoMudas()) ?? [];

producaoMudasBd.sort((a, b) => {
  // Comparar por ano (convertido para número, se quiser numérica)
  if (a.ano !== b.ano) return a.ano.localeCompare(b.ano);

  // Se ano for igual, comparar cultivar
  if (a.cultivar !== b.cultivar) return a.cultivar.localeCompare(b.cultivar);

  // Se cultivar for igual, comparar semente
  return a.semente.localeCompare(b.semente);
});

// CRIAR FILTRO DE PESQUISA ANO
const selectFiltrarAno = document.getElementById("ano-select-mudas");

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
const selectFiltrarCultivar = document.getElementById("cultivar-select-mudas");

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

// CRIAR FILTRO DE PESQUISA SEMENTE
const selectFiltrarSemente = document.getElementById("semente-select-mudas");

// Filtrando objetos únicos por semente
const listaUnicaSemente = producaoMudasBd.filter(
  (objeto, indice, self) =>
    indice === self.findIndex((t) => t.semente === objeto.semente)
);
// Criando uma lista com sementes únicas
const novaListaSemente = listaUnicaSemente.map((objeto, index) => ({
  id: index + 1, // Renomeando IDs a partir do número 1
  semente: objeto.semente,
}));

criarSelect(novaListaSemente, selectFiltrarSemente, "semente");

// CRIAR FILTRO DE PESQUISA EMBALAGEM
const selectFiltrarEmbalagem = document.getElementById(
  "embalagem-select-mudas"
);

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

// VISUALIZAR OS FILTROS
function visualizarFiltros() {
  console.log("Visualizar filtros");
  document.getElementById("filtros-mudas").classList.remove("hidden");
  document.getElementById("header-mudas").classList.add("hidden");
}

const btnVisualizarFiltros = document.getElementById(
  "icone-filtro-mudas-cadastradas"
);
btnVisualizarFiltros.addEventListener("click", visualizarFiltros);

function FecharFiltros() {
  document.getElementById("filtros-mudas").classList.add("hidden");
  document.getElementById("header-mudas").classList.remove("hidden");
}
const btnFecharFiltros = document.getElementById(
  "icone-fechar-filtro-mudas-cadastradas"
);
btnFecharFiltros.addEventListener("click", FecharFiltros);

let listaFiltros = [
  selectFiltrarAno,
  selectFiltrarCultivar,
  selectFiltrarSemente,
  selectFiltrarEmbalagem,
];

listaFiltros.forEach((select) => {
  select.addEventListener("change", filtrarLista);
});

async function filtrarLista() {
  containerCultivarBd.innerHTML = "";
  // containerCultivarBd.remove();
  producaoTotal = 0;
  let novaLista = await producaoMudasBd;

  const ano = selectFiltrarAno.value;
  const cultivar = selectFiltrarCultivar.value;
  const semente = selectFiltrarSemente.value;
  const embalagem = selectFiltrarEmbalagem.value;

  const filtrado = novaLista.filter((item) => {
    return (
      (!ano || item.ano === ano) &&
      (!cultivar || item.cultivar === cultivar) &&
      (!semente || item.semente === semente) &&
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
  for (const item of filtrado) {
    producaoTotal += Number(item.producao);
    criarCartaoCultivar(item, containerCultivarBd);
  }
  document.getElementById(
    "producao-mudas-cadastradas"
  ).innerHTML = `PRODUÇÃO: ${producaoTotal.toLocaleString("pt-BR")}`;
}

// ESTILIZAR CARTÃO
function estilizarCard(id) {
  const cardSelect = document.getElementById(`card-producao-mudas${id}`);
  const cardCultivar = document.getElementById(`cultivar-card${id}`);
  const cardSemente = document.getElementById(`semente-card${id}`);
  const cardEmbalagem = document.getElementById(`embalagem-card${id}`);
  const cardProducao = document.getElementById(`producao-card${id}`);
  const btnEditar = document.getElementById(`mudas-btn-edi-atu-mudas${id}`);
  const btnExcluir = document.getElementById(`mudas-btn-exc-mudas${id}`);

  cardSelect.style.backgroundColor = "#273469";
  cardSelect.style.color = "rgb(226 232 240)";

  cardCultivar.style.color = "rgb(226 232 240)";
  cardSemente.style.color = "rgb(226 232 240)";
  cardEmbalagem.style.color = "rgb(226 232 240)";
  cardProducao.style.color = "rgb(226 232 240)";
  btnEditar.style.color = "#273469";
  btnExcluir.style.color = "#273469";
}

let pegarId = [];
let pegarMudaProducao = [];

function cartaoCultivar(objeto) {
  let cartaoCultivarBd = `
  <p id="cultivar-card${objeto.id}" class="cultivar-card">${
    objeto.cultivar
  } </p>
  <p id="ano-card${objeto.ano}" class="ano-card">${objeto.ano} </p>
  <p id="semente-card${objeto.id}">${objeto.semente}</p>
  <p id="embalagem-card${objeto.id}">${objeto.embalagem}</p>
  <p id="producao-card${objeto.id}">${Number(objeto.producao).toLocaleString(
    "pt-BR"
  )}</p>

  <div id="${objeto.id}" class="mudas-card-btn">
    <button id="mudas-btn-edi-atu-mudas${
      objeto.id
    }" class="mudas-btn-edi-mudas">
      <i class="fa-regular fa-pen-to-square"></i>
    </button>
    <button id="mudas-btn-exc-mudas${objeto.id}" class="mudas-btn-exc-mudas">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;
  return cartaoCultivarBd;
}

async function criarCartaoCultivar(cultivarObjeto, elemento) {
  let container = elemento;
  const elementoArticle = document.createElement("article"); // <article></article>
  elementoArticle.id = `card-producao-mudas${cultivarObjeto.id}`;
  elementoArticle.classList.add("mudas-mudasbd-div");

  elementoArticle.innerHTML = cartaoCultivar(cultivarObjeto);
  container.appendChild(elementoArticle);

  document
    .getElementById(`mudas-btn-exc-mudas${cultivarObjeto.id}`)
    .addEventListener("click", async () => {
      estilizarCard(cultivarObjeto.id);
      await deletarProducaoMudas(cultivarObjeto);
      renderizarCard(buscarProducaoMudas());
    });

  document
    .getElementById(`mudas-btn-edi-atu-mudas${cultivarObjeto.id}`)
    .addEventListener("click", () => {
      pegarId.push(cultivarObjeto.id);
      if (pegarId.length > 1) {
        renderizarCard(buscarProducaoMudas());

        return;
      }
      document.getElementById("mudas-btn-edi-mudas").classList.remove("hidden");
      document.getElementById("mudas-btn-add-mudas").classList.add("hidden");
      pegarMudaProducao.push(cultivarObjeto);
      selectYear.value = pegarMudaProducao[0].ano;
      selectYear.disabled = true;
      selectSeeds.value = pegarMudaProducao[0].semente;
      selectSeeds.disabled = true;
      selectPackagings.value = pegarMudaProducao[0].embalagem;
      selectPackagings.disabled = true;
      selectCultivares.value = pegarMudaProducao[0].cultivar;
      selectCultivares.disabled = true;
      estilizarCard(pegarId);
    });
}

// EDITAR PRODUÇÃO DE MUDAS
document
  .getElementById("mudas-btn-edi-mudas")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    if (pegarMudaProducao.length > 0) {
      pegarMudaProducao[0].producao = Number(
        inputProducao.value.replace(/\./g, "")
      );
      pegarMudaProducao[0].idmuda = `${pegarMudaProducao[0].ano}-${pegarMudaProducao[0].cultivar}-${pegarMudaProducao[0].semente}-${pegarMudaProducao[0].embalagem}`;
    }
    // console.log("cultivarObjeto", cultivarObjeto);

    // pegarMudaProducao.push(cultivarObjeto);
    await editarProducaoMudasBd(pegarMudaProducao[0]);
    renderizarCard(buscarProducaoMudas());
    document.getElementById("mudas-form-mudasbd").reset();

    selectYear.disabled = false;
    selectSeeds.disabled = false;
    selectPackagings.disabled = false;
    selectCultivares.disabled = false;
    document.getElementById("mudas-btn-edi-mudas").classList.add("hidden");
    document.getElementById("mudas-btn-add-mudas").classList.remove("hidden");
  });

// INPUTS
const selectAno = document.getElementById("ano-select");
const selectSemente = document.getElementById("semente-select");
const selectEmbalagem = document.getElementById("embalagem-select");
const selectCultivar = document.getElementById("cultivar-select");
const inputProducao = document.getElementById("producao-input");

inputProducao.addEventListener("input", () => {
  let valor = inputProducao.value.replace(/\D/g, ""); // remove tudo que não é número
  valor = Number(valor).toLocaleString("pt-BR"); // formata com ponto de milhar
  inputProducao.value = valor;
});

function pegarInputs() {
  // Inputs valor
  const selectAnoValor = selectAno.value;
  const selectSementeValor = selectSemente.value;
  const selectEmbalagemValor = selectEmbalagem.value;
  const selectCultivarValor = selectCultivar.value;
  const inputProducaoValor = inputProducao.value
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "");

  if (
    selectAnoValor.length === 0 ||
    selectSementeValor.length === 0 ||
    selectEmbalagemValor.length === 0 ||
    selectCultivarValor.length === 0 ||
    inputProducaoValor.length === 0
  ) {
    alert("Por favor preencher todos os dados!!!");
    return;
  }
  return [
    selectAnoValor,
    selectSementeValor,
    selectEmbalagemValor,
    selectCultivarValor,
    inputProducaoValor,
  ];
}

// BOTÃO ADICIONAR PRODUÇÃO DE MUDAS
document
  .getElementById("mudas-btn-add-mudas")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    if (!pegarInputs()) {
      return;
    }
    if (Number(pegarInputs().length) < 5) {
      return;
    }
    let idMuda = `${pegarInputs()[0]}-${pegarInputs()[3]}-${pegarInputs()[1]}-${
      pegarInputs()[2]
    }`;
    let pegarMudasCadastradas = await buscarProducaoMudas();
    const novaMuda = {
      idmuda: idMuda,
      ano: pegarInputs()[0],
      semente: pegarInputs()[1],
      embalagem: pegarInputs()[2],
      cultivar: pegarInputs()[3],
      producao: pegarInputs()[4],
    };
    let acharMuda = pegarMudasCadastradas.filter(
      (f) => f.idmuda === novaMuda.idmuda
    );

    if (acharMuda.length !== 0) {
      estilizarCard(acharMuda[0].id);
      alert("Essa produção de mudas já existe!!!");
      return;
    }

    await cadastrarMudas(
      idMuda,
      pegarInputs()[0],
      pegarInputs()[1],
      pegarInputs()[2],
      pegarInputs()[3],
      pegarInputs()[4]
    );
    renderizarCard(buscarProducaoMudas());
    document.getElementById("mudas-form-mudasbd").reset();
  });

async function renderizarCard(bancoDados) {
  producaoTotal = 0;
  containerCultivarBd.innerHTML = "";
  for (const item of await bancoDados) {
    await criarCartaoCultivar(item, containerCultivarBd);
    producaoTotal += Number(item.producao);
    document.getElementById(
      "producao-mudas-cadastradas"
    ).innerHTML = `PRODUÇÃO: ${producaoTotal.toLocaleString("pt-BR")} mudas`;
  }
}

renderizarCard(producaoMudasBd);
