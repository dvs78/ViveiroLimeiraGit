import { buscarProducaoMudas } from "../../apiFront/reqMudas.js";

export let catalogo = await buscarProducaoMudas();

// ORDENAR OS DADOS
catalogo.sort((a, b) => a.cultivar.localeCompare(b.cultivar));
