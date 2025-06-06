let mensagem = document.getElementById("mensagem-erro-clientes");

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://viveirolimeiragit.onrender.com/api";

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
    console.error("Erro ao buscar clientes", error);
    alert("Erro ao buscar clientes");
  }
}

// ADICIONAR CLIENTE
export async function cadastrarCliente(nome, sobrenome) {
  try {
    const response = await fetch(`${BASE_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        sobrenome,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data; // Retorna os dados do cliente
    } else {
      return { error: data.error || "Erro ao adicionar cliente." };
    }

    // if (response.ok) {
    //   mensagem.innerText = `Cliente ${data.nome} adicionado com sucesso!`;
    //   document.getElementById("nome").value = ""; // Limpa o campo
    // } else {
    //   mensagem.innerText = data.error || "Erro ao adicionar cliente.";
    // }
  } catch (error) {
    // console.error("Erro ao buscar clientes", error);
    // console.error("Erro ao buscar clientes", error);
    // console.error("Erro ao cadastrar cliente:", error);
    alert("Erro de conexão com o servidor11.");
    mensagem.innerText = "Erro de conexão com o servidor.";
  }
}
