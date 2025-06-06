import {
  capitalizePalavras,
  mostrarMensagem,
} from "../src/components/funcoesDiversas.js";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://viveirolimeiragit.onrender.com/api";

// BUSCAR ENTREGAS
export async function buscarEntregas() {
  try {
    const response = await fetch(`${BASE_URL}/entregas`);

    if (!response.ok) {
      throw new Error("Erro ao buscar entregas");
    }
    const entregas = await response.json();
    return entregas;
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    return [];
  }
}

// CADASTRAR ENTREGA
export async function salvarEntregas(lista) {
  try {
    const response = await fetch(`${BASE_URL}/entregas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lista),
    });

    if (response.ok) {
      mostrarMensagem("Entrega cadastrada com sucesso!");
    } else {
      mostrarMensagem("Erro ao cadastrar entrega!" + error.message, "#ff4a47");
    }
  } catch (error) {
    console.error("Erro:", error);
    mostrarMensagem("Erro de conexão ao cadastrar entrega!", "#ff4a47");
  }
}

export async function editarEntregas(objeto) {
  try {
    const response = await fetch(`${BASE_URL}/entregas/${Number(objeto.id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    });

    if (response.ok) {
      mostrarMensagem("Entrega atualizada com sucesso!", "#4caf50");
    } else {
      const error = await response.json();
      console.error("Erro na atualização:", error);
      mostrarMensagem("Erro ao atualizar a entrega!", "#f44336");
    }
  } catch (err) {
    console.error("Erro de conexão:", err);
    mostrarMensagem("Erro de conexão com o servidor.", "#f44336");
  }
}

// EXCLUIR ENTREGA
export async function excluirEntrega(lista, id) {
  const entrega = lista.find((e) => Number(e.id) === Number(id));
  if (!entrega) return;

  const confirmado = confirm(
    `Deseja realmente excluir a entrega de ${entrega.entrega} mudas do dia ${entrega.data}?`
  );
  if (!confirmado) return;

  try {
    const response = await fetch(`${BASE_URL}/entregas/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      mostrarMensagem("Entrega excluída com sucesso!", "#4caf50");
    } else {
      mostrarMensagem("Erro ao excluir entrega.", "#ff4a47");
    }
  } catch (err) {
    console.error("Erro de conexão:", err);
    mostrarMensagem("Erro de conexão com o servidor.", "#f44336");
  }
}
