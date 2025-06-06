import { Router } from "express";
import DbClassPedidos from "../dbOnLine/DbClassPedidos.js";

const rotas = Router();

// ROTA PARA PEGAR TUDO
rotas.get("/", async (req, res) => {
  const result = await new DbClassPedidos().getAll();
  res.status(200).send(result);
});

// ROTA PARA PEGAR 1 CLIENTE
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassPedidos().getById(id);
  res.status(200).send(result);
});

// ROTA PARA INSERIR SOMENTE 1 ITEM
rotas.post("/", async (req, res) => {
  const { body } = req;
  const columnsArray = [
    "idcliente",
    "idmuda",
    "data",
    "precomuda",
    "desconto",
    "precomudadesconto",
    "pedido",
    "precomudatotal",
  ];
  // O método .reduce() é usado em arrays para reduzir seus elementos a um único valor, aplicando uma função acumuladora a cada item do array.
  const valuesArray = columnsArray.reduce((acc, columnName) => {
    acc.push(body[columnName]);
    return acc;
  }, []);

  await new DbClassPedidos().insertOne(valuesArray);
  res.status(200).send();
});

// ROTA PARA ATUALIZAR 1 ITEM
rotas.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const columnsArray = [
    "idcliente",
    "idmuda",
    "data",
    "precomuda",
    "desconto",
    "precomudadesconto",
    "pedido",
    "precomudatotal",
  ];

  const valuesArray = columnsArray.map((col) => body[col]);

  await new DbClassPedidos().updateById(id, valuesArray);
  res.status(200).send({ message: "Pedido atualizado com sucesso" });
});

// ROTA PARA DELETAR UM ITEM
rotas.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await new DbClassPedidos().deleteById(id);
  res.status(200).send({ message: "Pedido excluído com sucesso" });
});

export default rotas;
