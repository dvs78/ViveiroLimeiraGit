// SELECT FUNÇÃO
export function criarSelect(lista, html, chave) {
  let listaSelect = Array.from(
    new Map(lista.map((p) => [p[chave], p])).values()
  );
  listaSelect.sort((a, b) => a[chave].localeCompare(b[chave]));
  for (const item of listaSelect) {
    const option = document.createElement("option");
    option.id = item.id;
    option.value = item[chave];
    option.textContent = item[chave];
    html.appendChild(option);
  }
}

export function criarSelectMaiusculo(lista, html, chave) {
  let listaSelect = Array.from(
    new Map(lista.map((p) => [p[chave], p])).values()
  );
  listaSelect.sort((a, b) => a[chave].localeCompare(b[chave]));
  for (const item of listaSelect) {
    const option = document.createElement("option");
    option.id = item.id;
    option.value = item[chave];
    option.textContent = capitalizePalavras(item[chave]);
    html.appendChild(option);
  }
}

export function preencherSelectPorValor(select, valor) {
  return new Promise((resolve) => {
    select.value = valor;

    // Garante que o evento "change" seja disparado
    select.dispatchEvent(new Event("change"));

    // Aguarda um ciclo de renderização do DOM (~16ms)
    requestAnimationFrame(() => resolve());
  });
}

export function formatarNumero(valorString) {
  return Number(valorString.trim().replace(/\./g, "")) || 0;
}

export function formatarParaLocaleString(input) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, ""); // remove tudo que não é número
    if (!valor) {
      input.value = "";
      return;
    }
    const numero = parseInt(valor);
    input.value = numero.toLocaleString("pt-BR");
  });
}

export function capitalizePalavras(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

export function formatarTelefone(telefone) {
  const apenasDigitos = telefone.replace(/\D/g, ""); // remove tudo que não for número

  if (apenasDigitos.length === 11) {
    // Celular com 9 dígitos
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(
      2,
      7
    )}-${apenasDigitos.slice(7)}`;
  } else if (apenasDigitos.length === 10) {
    // Telefone fixo com 8 dígitos
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(
      2,
      6
    )}-${apenasDigitos.slice(6)}`;
  } else {
    return telefone; // se for fora do padrão
  }
}

export function formatarCEP(cep) {
  const apenasDigitos = cep.replace(/\D/g, ""); // remove não-dígitos
  if (apenasDigitos.length === 8) {
    return apenasDigitos.replace(/(\d{5})(\d{3})/, "$1-$2");
  }
  return cep; // retorna como veio se não tiver 8 dígitos
}

export function formatarIEMinasGerais(ie) {
  // Remove qualquer caractere não numérico
  ie = ie.replace(/\D/g, "");

  // Verifica se tem exatamente 13 dígitos
  if (ie.length !== 13) {
    return "";
  } else {
    return ie.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})$/, "$1.$2.$3/$4");
  }
}

export function formatarCPF(cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");
  // Garante que tenha 11 dígitos
  if (cpf.length !== 11) {
    // alert("O cpf precisa ter 11 números");
    return "";
  } else {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}

export function formatarParaReal(valor) {
  let numero = parseFloat(valor.toString().replace(",", "."));
  if (isNaN(numero)) return "";
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarParaPorcentagem(valor) {
  let numero = parseFloat(valor.toString().replace(",", "."));
  if (isNaN(numero)) return "";
  return `${numero.toFixed(2)}%`;
}

export function inputPassarParaNumero(input) {
  let valor = input.value;
  valor = valor.replace(",", ".");

  // Tenta converter para número
  const numero = parseFloat(valor);

  // Se for número válido, formata com 2 casas
  if (!isNaN(numero)) {
    input.value = numero.toFixed(2);
  } else {
    input.value = ""; // limpa se for inválido (ou pode manter o valor antigo, se preferir)
  }
}

export function mostrarMensagem(texto, cor = "#4caf50") {
  const mensagem = document.getElementById("mensagem-toast");
  mensagem.textContent = texto;
  mensagem.style.backgroundColor = cor;
  mensagem.classList.remove("display-mensagem"); // remove classe hidden
  mensagem.classList.add("show");

  setTimeout(() => {
    mensagem.classList.remove("show");
    mensagem.classList.add("display-mensagem"); // volta a esconder
  }, 3000);
}

// FUNÇÃO VALIDAR CAMPO
export function validarCampo(input) {
  if (!input.value.trim()) {
    input.classList.add("erro");
    return false;
  }
  input.classList.remove("erro");
  return true;
}

export function validarCampos(listaDeCampos) {
  let todosValidos = true;

  listaDeCampos.forEach((campo) => {
    const valido = validarCampo(campo);
    if (!valido) todosValidos = false;
  });

  return todosValidos;
}
