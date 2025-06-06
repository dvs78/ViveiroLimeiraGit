import { Router } from "express";
import DbClassCarrinho from "../dbOnLine/DbClassCarrinho.js";

const rotas = Router();

// ROTA PARA PEGAR O CARRINHO
rotas.get("/", async (req, res) => {
  const result = await new DbClassCarrinho().getAll();
  res.status(200).send(result);
});

// ROTA PARA PEGAR 1 PRODUTO DO CARRINHO
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassCarrinho().getById(id);
  res.status(200).send(result);
});

// ROTA PARA INSERIR 1 CARRINHO
rotas.post("/", async (req, res) => {
  const { body } = req;
  const columnsArray = [
    "id",
    "idPedido",
    "ano",
    "cultivar",
    "semente",
    "embalagem",
    "precoMuda",
    "desconto",
    "precoMudaDesconto",
    "pedido",
    "precoMudaTotal",
  ];
  // O método .reduce() é usado em arrays para reduzir seus elementos a um único valor, aplicando uma função acumuladora a cada item do array.
  const valuesArray = columnsArray.reduce((acc, columnName) => {
    acc.push(body[columnName]);
    return acc;
  }, []);

  await new DbClassCarrinho().insertOne(valuesArray);
  res.status(200).send();
});

// ROTA PARA EXCLUIR TODAS AS MUDAS DO CARRINHO
// rotas.delete("/", async (req, res) => {
//   const result = await new DbClassCarrinho().deleteAll();
//   res.status(200).send(result);
// });

export default rotas;
