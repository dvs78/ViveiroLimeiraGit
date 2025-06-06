import { catalogo } from "./produtos.js";
import { renderizarCatalogo } from "./cartaoProduto.js";

const selectCultivares = document.getElementById("cultivares-select");
const radioEmbalagens = document.querySelectorAll('input[name="radio-mudas"]');

// CRIAR A LISTA DE CULTIVARES
let cultivares = [];
for (const cultivar of catalogo) {
  let cultivarObjeto = {
    id: cultivar.id,
    nome: cultivar.nome,
  };
  cultivares.push(cultivarObjeto);
}

// CRIAR O SELECT DAS CULTIVARES
function criarSelectCultivares() {
  // Remover duplicatas pelo nome
  const listaCultivares = Array.from(
    new Map(cultivares.map((cultivar) => [cultivar.nome, cultivar])).values()
  );
  // let listaCultivarSelecionada = [];
  listaCultivares.forEach((cultivar) => {
    const option = document.createElement("option");
    option.id = cultivar.id;
    option.value = cultivar.id;
    option.textContent = cultivar.nome;
    selectCultivares.appendChild(option);
  });
}
criarSelectCultivares();

// CRIAR O OBJETO DE SELEÇÃO DA CULTIVAR e EMBALAGEM
let selecao = {};

// PEGAR CULTIVAR
let selecionar;
function pegarCultivar() {
  selecionar = selectCultivares.options[selectCultivares.selectedIndex].text;
  selecao.nome = selecionar;
  return selecao;
}
