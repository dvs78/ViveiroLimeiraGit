import {
  capitalizePalavras,
  mostrarMensagem,
} from "../src/components/funcoesDiversas";

const BASE_URL = "http://localhost:3000/api";
// const { NODE_ENV } = process.env;
// const BASE_URL =
//   NODE_ENV === "development" ? "http://localhost:3000/api" : "/api";

// BUSCAR CLIENTES
export async function buscarClientes() {
  try {
    const response = await fetch(`${BASE_URL}/clientes`);

    if (!response.ok) {
      throw new Error("Erro ao buscar clientes");
    }
    const clientes = await response.json();
    return clientes;
  } catch (error) {
    console.error("Erro ao buscar nomes:", error);
    return []; // <- retorna lista vazia em caso de erro
  }
}

// CADASTRAR CLIENTE
export async function cadastrarClientes(
  nome,
  sobrenome,
  nomeCompleto,
  telefone,
  email,
  cpf,
  inscricaoEstadual,
  rua,
  bairro,
  cep,
  cidade,
  estado
) {
  const cliente = {
    nome,
    sobrenome,
    nomecompleto: nomeCompleto,
    telefone,
    email,
    cpf,
    inscricaoestadual: inscricaoEstadual,
    rua,
    bairro,
    cep,
    cidade,
    estado,
  };
  if (
    !confirm(
      `Tem certeza que deseja adicionar: ${await capitalizePalavras(
        cliente.nomecompleto
      )} - ${cliente.inscricaoestadual}?`
    )
  )
    return;
  const response = await fetch(`${BASE_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });
  try {
    if (response.ok) {
      mostrarMensagem(
        `Cliente ${capitalizePalavras(cliente.nomecompleto)} - ${
          cliente.inscricaoestadual
        } adicionado com sucesso!`
      );
    }
    if (!response.ok) {
      mostrarMensagem("Erro ao adicionar cliente!", "#ff4a47");
    }
  } catch (error) {
    mostrarMensagem("Erro ao adicionar cliente, catch!", "#ff4a47");
  }
}

// EDITAR CLIENTE
export async function editarCliente(id, inputs) {
  const body = {
    nome: await inputs[0].nome,
    sobrenome: await inputs[0].sobrenome,
    nomecompleto: await inputs[0].nomeCompleto,
    telefone: await inputs[0].telefone,
    email: await inputs[0].email,
    cpf: await inputs[0].cpf,
    inscricaoestadual: await inputs[0].inscricaoEstadual,
    rua: await inputs[0].rua,
    bairro: await inputs[0].bairro,
    cep: await inputs[0].cep,
    cidade: await inputs[0].cidade,
    estado: await inputs[0].estado,
  };

  try {
    const response = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      mostrarMensagem(
        `Cliente ${capitalizePalavras(body.nomecompleto)} - ${
          body.inscricaoestadual
        } atualizado com sucesso!`
      );
    } else {
      const error = await response.json();
      mostrarMensagem("Erro ao adicionar cliente!", +error.message, "#ff4a47");
      alert("Erro ao atualizar: " + error.message);
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com o servidor", "#ff4a47");
  }
}

// EXCLUIR CLIENTE
export async function deletarCliente(cliente) {
  if (
    !confirm(
      `Tem certeza que deseja excluir: ${await capitalizePalavras(
        cliente.nomecompleto
      )} - ${cliente.inscricaoestadual}?`
    )
  )
    return;
  document.getElementById(cliente.id).remove();
  try {
    const response = await fetch(`${BASE_URL}/clientes/${cliente.id}`, {
      method: "DELETE",
    });

    // let clientePromise = await cliente;

    if (response.ok) {
      mostrarMensagem(
        `Cliente ${capitalizePalavras(cliente.nomecompleto)} - ${
          cliente.inscricaoestadual
        } excluído com sucesso!`
      );
    } else {
      const error = await response.json();
      mostrarMensagem("Erro ao adicionar cliente!", +error.message, "#ff4a47");
    }
  } catch (error) {
    mostrarMensagem("Erro de conexão com o servidor", "#ff4a47");
    alert("Erro de conexão com o servidor.");
  }
}
