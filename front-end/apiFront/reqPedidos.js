import {
  capitalizePalavras,
  mostrarMensagem,
} from "../src/components/funcoesDiversas.js";

const BASE_URL = "https://viveirolimeiragit.onrender.com/api";
// const { NODE_ENV } = process.env;
// const BASE_URL =
//   NODE_ENV === "development" ? "http://localhost:3000/api" : "/api";

// BUSCAR CLIENTES
export async function buscarPedidos() {
  try {
    const response = await fetch(`${BASE_URL}/pedidos`);

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos");
    }
    const clientes = await response.json();
    return clientes;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
}

// CADASTRAR PEDIDO
export async function salvarPedidos(
  idcliente,
  idmuda,
  data,
  precomuda,
  desconto,
  precomudadesconto,
  pedido,
  precomudatotal
) {
  const listaPedido = {
    idcliente,
    idmuda,
    data,
    precomuda,
    desconto,
    precomudadesconto,
    pedido,
    precomudatotal,
  };

  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listaPedido),
  });
  try {
    if (response.ok) {
      mostrarMensagem("Pedido cadastrado com sucesso!");
    }
    if (!response.ok) {
      mostrarMensagem("Erro ao adicionar pedido!", "#ff4a47");
    }
  } catch (error) {
    mostrarMensagem("Erro ao adicionar pedido!", +error, "#ff4a47");
  }
}

// EDITAR PEDIDO
export async function editarPedidos(objeto) {
  const body = objeto;
  mostrarMensagem("Pedido atualizado com sucesso!");
  try {
    const response = await fetch(`${BASE_URL}/pedidos/${objeto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      mostrarMensagem("Pedido atualizado com sucesso!");
    } else {
      const error = await response.json();
      mostrarMensagem("Erro ao atualizar o pedido!", "#f44336");
      // alert("Erro ao atualizar: " + error.message);
    }
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro de conexão com o servidor.", "#f44336");
  }
}

// EXCLUIR PEDIDO
export async function deletarPedido(objeto) {
  if (
    !confirm(
      `Tem certeza que deseja excluir: ${await capitalizePalavras(
        objeto.nomecompleto
      )} - ${objeto.cultivar} - ${objeto.embalagem} - ${objeto.pedido}?`
    )
  )
    return;

  try {
    const response = await fetch(`${BASE_URL}/pedidos/${objeto.id}`, {
      method: "DELETE",
    });

    // let clientePromise = await cliente;

    if (response.ok) {
      alert(
        `${await capitalizePalavras(objeto.nomecompleto)} - ${
          objeto.cultivar
        } - ${objeto.embalagem} - ${objeto.pedido} foi excluído! `
      );
    } else {
      const error = await response.json();
      alert("Erro ao deletar: " + error.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
}
