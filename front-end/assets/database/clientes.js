import {
  buscarClientes,
  cadastrarClientes,
  editarCliente,
  deletarCliente,
} from "../../apiFront/reqClientes.js";

import {
  mostrarMensagem,
  capitalizePalavras,
  formatarTelefone,
  formatarCPF,
  formatarIEMinasGerais,
  formatarCEP,
} from "../../src/components/funcoesDiversas.js";

// INPUTS
let inputNome = document.getElementById("nome");
let inputSobrenome = document.getElementById("sobrenome");
let inputTelefone = document.getElementById("telefone");
let inputEmail = document.getElementById("email");
let inputCpf = document.getElementById("cpf");
let inputInscricaoEstadual = document.getElementById("inscricaoEstadual");
let inputRua = document.getElementById("rua");
let inputBairro = document.getElementById("bairro");
let inputCep = document.getElementById("cep");
let inputCidade = document.getElementById("cidade");
let inputEstado = document.getElementById("estado");

// VALIDAR CAMPOS
function validarCampos(dados) {
  return (
    dados.nome.length > 0 &&
    dados.sobrenome.length > 0 &&
    dados.telefone.length > 0 &&
    dados.email.length > 0 &&
    dados.cpf.length > 0 &&
    dados.inscricaoEstadual.length > 0 &&
    dados.rua.length > 0 &&
    dados.bairro.length > 0 &&
    dados.cep.length > 0 &&
    dados.cidade.length > 0 &&
    dados.estado.length > 0
  );
}

// BUSCAR CLIENTES e MONTAR HTML COM NOME COMPLETO e INSCRIÇÃO ESTADUAL

async function buscarClientesBd() {
  let clientesBd = (await buscarClientes()) ?? [];

  clientesBd.sort((a, b) => {
    // Comparar por ano (convertido para número, se quiser numérica)
    if (a.nomecompleto !== b.nomecompleto)
      return a.nomecompleto.localeCompare(b.nomecompleto);

    // Se ano for igual, comparar cultivar
    if (a.inscricaoestadual !== b.inscricaoestadual)
      return a.inscricaoestadual.localeCompare(b.inscricaoestadual);

    // // Se cultivar for igual, comparar semente
    // return a.semente.localeCompare(b.semente);
  });
  console.log("Rodei clintes bd");
  return clientesBd;
}

// VISUALIZAR BOTÃO CLIENTE AQUI SIM
const btnEdit = document.getElementById("clientes-btn-edi-cliente");
const btnAdd = document.getElementById("clientes-btn-add-cliente");

function viewBtnEdit() {
  btnEdit.classList.remove("hidden");
  btnAdd.classList.add("hidden");
}

function viewBtnAdi() {
  btnEdit.classList.add("hidden");
  btnAdd.classList.remove("hidden");
}

// FORMATAR INPUTS
document.getElementById("cpf").addEventListener("blur", function () {
  this.value = formatarCPF(this.value);
});

document
  .getElementById("inscricaoEstadual")
  .addEventListener("blur", function () {
    this.value = formatarIEMinasGerais(this.value);
  });

// CRIAR CLIENTE OBJETO, PEGRA OS INPUTS
function pegarInputs() {
  let estado = inputEstado.value
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "");
  let inscricaoEstadual = inputInscricaoEstadual.value;
  if (estado === "mg") {
    inscricaoEstadual = formatarIEMinasGerais(inscricaoEstadual);
  } else {
    // Mantém como digitado ou aplicar outra validação genérica
    inscricaoEstadual = inscricaoEstadual.trim();
  }
  let clienteObjeto = {
    nome: inputNome.value.trim().toLowerCase(),
    sobrenome: inputSobrenome.value.trim().toLowerCase(),
    nomeCompleto: `${inputNome.value
      .trim()
      .toLowerCase()} ${inputSobrenome.value.trim().toLowerCase()}`,
    telefone: formatarTelefone(
      inputTelefone.value.trim().replace(/[^a-zA-Z0-9]/g, "")
    ),
    email: inputEmail.value.trim().toLowerCase(),
    cpf: formatarCPF(inputCpf.value.trim().replace(/[^a-zA-Z0-9]/g, "")),
    inscricaoEstadual: inscricaoEstadual,
    rua: inputRua.value.trim().toLowerCase(),
    bairro: inputBairro.value.trim().toLowerCase(),
    cep: formatarCEP(
      inputCep.value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "")
    ),
    cidade: inputCidade.value.trim().toLowerCase(),
    estado: estado.trim().toLowerCase(),
  };
  return clienteObjeto;
}

// PREENCHER INPUTS DA FORMULÁRIO
function preencherInputs(objeto) {
  inputNome.value = capitalizePalavras(objeto.nome);
  inputSobrenome.value = capitalizePalavras(objeto.sobrenome);
  inputTelefone.value = objeto.telefone;
  inputEmail.value = objeto.email;
  inputCpf.value = objeto.cpf;
  inputInscricaoEstadual.value = objeto.inscricaoestadual;
  inputRua.value = objeto.rua;
  inputBairro.value = objeto.bairro;
  inputCep.value = objeto.cep;
  inputCidade.value = objeto.cidade;
  inputEstado.value = objeto.estado;
}

// CADASTRAR CLIENTES AQUI SIM
document
  .getElementById("clientes-btn-add-cliente")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    let dadosInputs = pegarInputs();
    validarCampos(dadosInputs);
    if (!validarCampos(dadosInputs)) {
      mostrarMensagem(
        "Por favor preencha os dados de forma correta!",
        "#ff4a47"
      );
      return;
    }

    let clientes = await buscarClientesBd();

    console.log("dadosInput", dadosInputs);

    if (Number(clientes.length) === 0) {
      await cadastrarClientes(
        dadosInputs.nome,
        dadosInputs.sobrenome,
        dadosInputs.nomeCompleto,
        dadosInputs.telefone,
        dadosInputs.email,
        dadosInputs.cpf,
        dadosInputs.inscricaoEstadual,
        dadosInputs.rua,
        dadosInputs.bairro,
        dadosInputs.cep,
        dadosInputs.cidade,
        dadosInputs.estado
      );
    }
    if (Number(clientes.length) > 0) {
      for (const cliente of clientes) {
        if (
          String(dadosInputs.inscricaoEstadual) ===
          String(cliente.inscricaoestadual)
        ) {
          mostrarMensagem("Essa inscrição estadual já existe!", "#ff4a47");
          return;
        }
      }
      await cadastrarClientes(
        dadosInputs.nome,
        dadosInputs.sobrenome,
        dadosInputs.nomeCompleto,
        dadosInputs.telefone,
        dadosInputs.email,
        dadosInputs.cpf,
        dadosInputs.inscricaoEstadual,
        dadosInputs.rua,
        dadosInputs.bairro,
        dadosInputs.cep,
        dadosInputs.cidade,
        dadosInputs.estado
      );

      document.getElementById("clientes-clientesbd").innerHTML = "";
      renderizarCardCliente();
      document.getElementById("clientes-form-clientesbd").reset();
    }
  });

function cartaoCliente(objeto) {
  const containerClientesBd = document.getElementById("clientes-clientesbd");
  const elementoArticle = document.createElement("article"); // <article></article>
  elementoArticle.id = objeto.id;
  elementoArticle.classList.add("clientes-clientesbd-div");
  let cartaoClienteBd = `
  <button id="clientes-btn-edi-atu-cliente${
    objeto.id
  }" class="clientes-btn-edi-cliente">
    <i class="fa-regular fa-pen-to-square"></i>
  </button>
  <p id="nome-card${objeto.id}" class="nomeCompleto-card">${capitalizePalavras(
    objeto.nomecompleto
  )}</p>
  <p id="insEst-card${objeto.id}">${objeto.inscricaoestadual}</p>
  <button id="clientes-btn-exc-cliente${
    objeto.id
  }" class="clientes-btn-exc-cliente">
    <i class="fa-solid fa-trash"></i>
  </button>`;

  elementoArticle.innerHTML = cartaoClienteBd;
  containerClientesBd.appendChild(elementoArticle);
}

let clienteSelecionado = 0;

async function criarCartaoCliente(clienteObjeto) {
  cartaoCliente(clienteObjeto);

  // EXCLUIR CLIENTE
  document
    .getElementById(`clientes-btn-exc-cliente${clienteObjeto.id}`)
    .addEventListener("click", async () => {
      let filtrarCliente = [clienteObjeto].filter(
        (f) => f.id === Number(clienteObjeto.id)
      );
      await deletarCliente(filtrarCliente[0]);
    });

  let btnLimpar = document.getElementById("clientes-btn-lim-form");
  btnLimpar.addEventListener("click", async () => {
    if (document.getElementById("nome").disabled) {
      viewBtnAdi();
      estilizarCartaoOriginal(clienteSelecionado);
    }
  });

  // SELECIONAR CLIENTE A SER ATUALIZADO
  document
    .getElementById(`clientes-btn-edi-atu-cliente${clienteObjeto.id}`)
    .addEventListener("click", async (e) => {
      e.preventDefault();
      viewBtnEdit();
      if (document.getElementById("nome").disabled) {
        estilizarCartaoOriginal(clienteSelecionado);
        let filtrarCliente = [clienteObjeto].filter(
          (f) => f.id === Number(clienteObjeto.id)
        );
        preencherInputs(filtrarCliente[0]);
      }

      const confirmacao = confirm(
        `Tem certeza que deseja editar: ${capitalizePalavras(
          clienteObjeto.nomecompleto
        )} - ${clienteObjeto.inscricaoestadual}?`
      );

      if (!confirmacao) {
        return; // Se o usuário cancelar, sai da função aqui
      }

      document.getElementById("nome").disabled = true;
      document.getElementById("sobrenome").disabled = true;
      document.getElementById("cpf").disabled = true;
      document.getElementById("inscricaoEstadual").disabled = true;

      let filtrarCliente = [clienteObjeto].filter(
        (f) => f.id === Number(clienteObjeto.id)
      );
      preencherInputs(filtrarCliente[0]);
      clienteSelecionado = 0;
      clienteSelecionado = filtrarCliente[0].id;

      estilizarCartaoSelecionado(clienteSelecionado);
      pegarInputs(filtrarCliente[0]);

      // if (
      //   !confirm(
      //     `Tem certeza que deseja editar: ${await capitalizePalavras(
      //       clienteObjeto.nomecompleto
      //     )} - ${clienteObjeto.inscricaoestadual}?`
      //   )
      // )
      //   return;
    });
}

function estilizarCartaoSelecionado(id) {
  document.getElementById(id).classList.remove("clientes-clientesbd-div");
  document.getElementById(id).classList.add("clientes-card-selecionado");
}
function estilizarCartaoOriginal(id) {
  document.getElementById(id).classList.remove("clientes-card-selecionado");
  document.getElementById(id).classList.add("clientes-clientesbd-div");
}

// console.log("dadosInput", dadosInput);

// ATUALIZAR CLIENTES aqui sim
document
  .getElementById("clientes-btn-edi-cliente")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("clienteSelecionado", clienteSelecionado);
    let id = clienteSelecionado;
    let dadosInputs = pegarInputs();
    let clienteEditar = [dadosInputs];

    validarCampos(dadosInputs);
    if (!validarCampos(dadosInputs)) {
      mostrarMensagem(
        "Por favor preencha os dados de forma correta!",
        "#ff4a47"
      );
      return;
    }

    // if (Number(clientesBd.length) > 0) {
    for (const cliente of await buscarClientesBd()) {
      if (cliente.id !== clienteSelecionado) {
      }
    }
    // }
    console.log("id", id, "clienteEditar", clienteEditar);
    await editarCliente(id, clienteEditar);
    document.getElementById(id).classList.remove("clientes-card-selecionado");
    document.getElementById(id).classList.add("clientes-clientesbd-div");
    renderizarCardCliente();
    viewBtnAdi();
    document.getElementById("clientes-form-clientesbd").reset();
  });

async function renderizarCardCliente() {
  document.getElementById("clientes-clientesbd").innerHTML = "";
  let bancoDados = await buscarClientesBd();
  for (const item of await bancoDados) {
    await criarCartaoCliente(item);
    // producaoTotal += Number(item.producao);
  }
}
renderizarCardCliente();
