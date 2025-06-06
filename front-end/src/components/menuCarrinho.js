import { buscarPedidos } from "../../apiFront/reqPedidos.js";
import { deletarCarrinho, salvarCarrinho } from "../../apiFront/reqCarrinho.js";

import { catalogo } from "../../assets/database/produtos.js";
import {
  inputPassarParaNumero,
  // formatarParaReal,
  // formatarParaPorcentagem,
} from "./funcoesDiversas.js";

let idsProdutoQtdeCarrinho = {};
let carrinhoTotalObjeto = [];

const textoProdutoTotal = document.getElementById("index-produto-total");
const valorProdutoTotal = document.getElementById("index-valor-total");

// ABRIR CARRINHO
function abrirCarrinho() {
  document.getElementById("carrinho").style.right = "0rem";
}

// FECHAR CARRINHO
function fecharCarrinho() {
  document.getElementById("carrinho").style.right = "-40rem";
}

// INICIALIZAR CARRINHO
export function inicializarCarrinho() {
  const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
  const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");

  botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
  botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
}

// REMOVER PRODUTO DO CARRINHO
function removerProdutoCarrinho(idProduto) {
  delete idsProdutoQtdeCarrinho[idProduto];

  for (const idProduto in idsProdutoQtdeCarrinho) {
    adicionarProdutoNoCarrinho(idProduto);
  }
  renderizarProdutosCarrinho();
}

// FUNCTION DESENHAR PRODUTO NO CARRINHO
function desenharProdutoCarrinho(idProduto) {
  if (!idProduto) {
    idsProdutoQtdeCarrinho[idProduto] = "";
  }

  let produto = catalogo.find((p) => p.id === idProduto);

  delete produto.estoque;
  delete produto.producao;
  carrinhoTotalObjeto.push(produto);

  const containerProdutosCarrinho =
    document.getElementById("produtos-carrinho");
  const elementoArticle = document.createElement("article"); // <article></article>
  elementoArticle.classList.add("cartao-produto-carrinho");
  const cartaoProdutoCarrinho = `
      <i id="remover-produto-${produto.id}" class="fechar-produto-carrinho fa-solid fa-circle-xmark"></i>
      <div class="container-article-carrinho">
      <div class="cultivar-embalagem-carrinho">
        <p id="cultivar-${produto.id}" class="cultivar-carrinho">${produto.cultivar}</p>
        <p id="embalagem-${produto.id}" class="embalagem-carrinho">${produto.embalagem}</p>
      </div>

      <div class="valor-adicionar-carrinho">
      <div>
        <label for="valor-muda-${produto.id}">R$_muda</label>
        <input type="text" id="valor-muda-${produto.id}" class="input-produto-carrinho valor-muda" placeholder="R$ 0,00">
        </div>

      <div>
        <label for="desconto-muda-${produto.id}">Desconto (%)</label>
        <input type="text" id="desconto-muda-${produto.id}" class="input-produto-carrinho desconto-muda" placeholder="0,00">
      </div>

      <div>
        <label for="valor-muda-desconto-${produto.id}">Desconto (R$_muda)</label>
        <input type="text" id="valor-muda-desconto-${produto.id}" class="input-produto-carrinho valor-muda-desconto" placeholder="R$ 0,00">
        </div>

      </div>

      <div class="qtde-adicionar-carrinho">
          <div>
            <label for="quantidade-${produto.id}">Qtde mudas</label>
            <input type="text" id="quantidade-${produto.id}" class="input-produto-carrinho" placeholder="0.0">
          </div>

          <div>
            <label for="valor-total-${produto.id}">R$ total</label>
            <input type="text" id="valor-total-${produto.id}" class="input-produto-carrinho" placeholder="R$ 0,00">
          </div>

          <div>
            <button id="adicionar-${produto.id}" class="adicionar-produto-carrinho">Adicionar</button>
          </div>

      </div>
      </div>`;

  elementoArticle.innerHTML = cartaoProdutoCarrinho;
  containerProdutosCarrinho.appendChild(elementoArticle);

  let btnFinalizarCompra = document.getElementById("index-finalizar-compra");
  btnFinalizarCompra.classList.remove("hidden");

  let inputValorMuda = document.getElementById(`valor-muda-${produto.id}`);

  let inputDescontoMuda = document.getElementById(
    `desconto-muda-${produto.id}`
  );

  let inputValorDescontoMuda = document.getElementById(
    `valor-muda-desconto-${produto.id}`
  );
  let inputValorMudaTotal = document.getElementById(
    `valor-total-${produto.id}`
  );
  let inputQtde = document.getElementById(`quantidade-${produto.id}`);

  inputValorMuda.addEventListener("blur", () => {
    inputPassarParaNumero(inputValorMuda);
    inputPassarParaNumero(inputDescontoMuda);
    if (inputDescontoMuda.value.length === 0) {
      inputValorDescontoMuda.value = inputValorMuda.value;
      if (inputQtde.value.length > 0) {
        let valor = inputQtde.value.replace(/\D/g, "");
        valor = Number(valor);
        inputValorMudaTotal.value = (
          Number(inputValorMuda.value) * valor
        ).toLocaleString("pt-BR");
      }
      return;
    }
    if (inputDescontoMuda.value.length > 0) {
      inputValorDescontoMuda.value = (
        inputValorMuda.value *
        ((100 - inputDescontoMuda.value) / 100)
      ).toFixed(2);
      if (inputQtde.value.length > 0) {
        let valor = inputQtde.value.replace(/\D/g, "");
        valor = Number(valor);
        inputValorMudaTotal.value = (
          Number(inputValorDescontoMuda.value) * valor
        ).toLocaleString("pt-BR");
      }
    }
  });
  inputDescontoMuda.addEventListener("blur", () => {
    inputPassarParaNumero(inputValorMuda);
    inputPassarParaNumero(inputDescontoMuda);

    if (inputValorMuda.value.length > 0) {
      inputValorDescontoMuda.value = (
        inputValorMuda.value *
        ((100 - inputDescontoMuda.value) / 100)
      ).toFixed(2);
      if (inputQtde.value.length > 0) {
        let valor = inputQtde.value.replace(/\D/g, "");
        valor = Number(valor);
        inputValorMudaTotal.value = (
          Number(inputValorDescontoMuda.value) * valor
        ).toLocaleString("pt-BR");
      }
    }
  });

  inputQtde.addEventListener("input", () => {
    let valor = inputQtde.value.replace(/\D/g, ""); // remove tudo que não é número
    valor = Number(valor).toLocaleString("pt-BR"); // formata com ponto de milhar
    inputQtde.value = valor;
  });

  inputQtde.addEventListener("blur", () => {
    let valor = inputQtde.value.replace(/\D/g, "");
    valor = Number(valor);
    inputValorMudaTotal.value = (
      Number(inputValorDescontoMuda.value) * valor
    ).toLocaleString("pt-BR");
  });

  document
    .getElementById(`remover-produto-${produto.id}`)
    .addEventListener("click", () => {
      removerProdutoCarrinho(produto.id);
    });

  document
    .getElementById(`quantidade-${produto.id}`)
    .addEventListener("input", (event) => {
      idsProdutoQtdeCarrinho[idProduto] = event.target.value;
      let atualizarPedido = carrinhoTotalObjeto.find(
        (p) => p.id === produto.id
      );
      if (atualizarPedido) {
        atualizarPedido.pedido = event.target.value;
      }
    });

  document
    .getElementById(`adicionar-${produto.id}`)
    .addEventListener("click", () => {
      adicionarProdutoNoCarrinho(produto.id);
    });
}

// RENDERIZAR PRODUTOS CARRINHO
function renderizarProdutosCarrinho() {
  const containerProdutosCarrinho =
    document.getElementById("produtos-carrinho");

  containerProdutosCarrinho.innerHTML = "";
  for (const idProduto in idsProdutoQtdeCarrinho) {
    console.log("idProduto", idProduto);
    desenharProdutoCarrinho(idProduto);
    // document.getElementById(`valor-muda-${produto.id}`).value =
    //   idsProdutoQtdeCarrinho[idProduto];
    document.getElementById(`quantidade-${idProduto}`).value =
      idsProdutoQtdeCarrinho[idProduto];
  }
}

// CARTÃO DO PRODUTO CARRINHO
export function adicionarAoCarrinho(idProduto) {
  // VERIFICAR SE O PRODUTO JÁ ESTÁ NA LISTA
  if (idProduto in idsProdutoQtdeCarrinho) {
    return;
  }
  idsProdutoQtdeCarrinho[idProduto] = 0;
  desenharProdutoCarrinho(idProduto);
}

textoProdutoTotal.classList.add("hidden");
valorProdutoTotal.classList.add("hidden");

// ADICIONAR
function adicionarProdutoNoCarrinho(idProduto) {
  idsProdutoQtdeCarrinho[idProduto] = document
    .getElementById(`quantidade-${idProduto}`)
    .value.replace(".", "");

  const inputPrecoMuda = parseFloat(
    document.getElementById(`valor-muda-${idProduto}`).value
  );
  const inputDesconto = parseFloat(
    document.getElementById(`desconto-muda-${idProduto}`).value
  );
  const inputQtdeProdutoCarrinho = parseFloat(
    document.getElementById(`quantidade-${idProduto}`).value
  );

  if (
    isNaN(inputPrecoMuda) ||
    isNaN(inputDesconto) ||
    isNaN(inputQtdeProdutoCarrinho) ||
    inputPrecoMuda < 0 ||
    inputDesconto < 0 ||
    inputQtdeProdutoCarrinho < 0 ||
    inputPrecoMuda === 0 ||
    inputDesconto === 0 ||
    inputQtdeProdutoCarrinho === 0
  ) {
    alert("Por favor, digite corretamente a quantidade de mudas!!!");
  }

  let qtdeTotal = [];
  let precoTotal = [];
  for (const idProduto in idsProdutoQtdeCarrinho) {
    let valorQtdeTotal = Number(idsProdutoQtdeCarrinho[idProduto]).toFixed(0);
    qtdeTotal.push(Number(valorQtdeTotal));
    precoTotal.push(
      Number(Number(idsProdutoQtdeCarrinho[idProduto])) *
        document.getElementById(`valor-muda-desconto-${idProduto}`).value
    );
  }
  textoProdutoTotal.classList.remove("hidden");
  textoProdutoTotal.innerText = `Mudas total: ${qtdeTotal
    .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0)
    .toLocaleString("pt-BR")}`;
  valorProdutoTotal.classList.remove("hidden");
  valorProdutoTotal.innerText = `Valor total: R$ ${precoTotal
    .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0)
    .toLocaleString("pt-BR")}`;
}

document
  .getElementById("index-finalizar-compra")
  .addEventListener("click", async () => {
    await deletarCarrinho();
    let listaPedidos = [];

    let pedido = {
      id: "",
      idPedido: "",
      ano: "",
      cultivar: "",
      semente: "",
      embalagem: "",
      cultivar: "",
      precoMuda: "",
      desconto: "",
      precoMudaDesconto: "",
      pedido: "",
      precoMudaTotal: "",
    };
    let produto = await catalogo;
    for (const idProduto in idsProdutoQtdeCarrinho) {
      pedido = {};
      let qtdeMuda = document.getElementById(`quantidade-${idProduto}`).value;
      let filtrar = produto.filter((f) => String(f.id) === String(idProduto));
      pedido.id = filtrar[0].id;
      pedido.idPedido = `${filtrar[0].idmuda}-${qtdeMuda}`;
      pedido.ano = filtrar[0].ano;
      pedido.cultivar = filtrar[0].cultivar;
      pedido.semente = filtrar[0].semente;
      pedido.embalagem = filtrar[0].embalagem;
      pedido.cultivar = filtrar[0].cultivar;
      pedido.precoMuda = document.getElementById(
        `valor-muda-${idProduto}`
      ).value;
      pedido.desconto = document.getElementById(
        `desconto-muda-${idProduto}`
      ).value;
      pedido.precoMudaDesconto = document.getElementById(
        `valor-muda-desconto-${idProduto}`
      ).value;
      pedido.pedido = document.getElementById(`quantidade-${idProduto}`).value;
      pedido.precoMudaTotal = document.getElementById(
        `valor-total-${idProduto}`
      ).value;
      listaPedidos.push(pedido);

      salvarCarrinho(
        pedido.id,
        pedido.idPedido,
        pedido.ano,
        pedido.cultivar,
        pedido.semente,
        pedido.embalagem,
        pedido.precoMuda,
        pedido.desconto,
        pedido.precoMudaDesconto,
        pedido.pedido,
        pedido.precoMudaTotal
      );
    }

    window.location.href = "checkout.html";
  });
