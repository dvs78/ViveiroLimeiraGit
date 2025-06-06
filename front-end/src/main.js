import { catalogo } from "../assets/database/produtos.js";

import {
  renderizarCatalogo,
  containerCartoes,
} from "../src/components/cartaoProduto.js";
import { inicializarCarrinho } from "../src/components/menuCarrinho.js";

// RENDERIZAR CATÁLOGO
renderizarCatalogo(catalogo, containerCartoes);

// INICIALIZAR CARRINHO
inicializarCarrinho();
