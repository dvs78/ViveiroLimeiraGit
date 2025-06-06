import { Router } from "express";
import DbClassEntregas from "../dbOnLine/DbClassEntregas.js";

const rotas = Router();

// ROTA PARA PEGAR TUDO
rotas.get("/", async (req, res) => {
  const result = await new DbClassEntregas().getAll();
  res.status(200).send(result);
});

// ROTA PARA PEGAR 1 CLIENTE
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassEntregas().getById(id);
  res.status(200).send(result);
});

// ROTA PARA INSERIR SOMENTE 1 ITEM
rotas.post("/", async (req, res) => {
  const { body } = req;
  const columnsArray = [
    "data",
    "idcliente",
    "idmuda",
    "idpedido",
    "veiculo",
    "motorista",
    "entrega",
    "qtdepessoas",
  ];
  // O método .reduce() é usado em arrays para reduzir seus elementos a um único valor, aplicando uma função acumuladora a cada item do array.
  const valuesArray = columnsArray.reduce((acc, columnName) => {
    acc.push(body[columnName]);
    return acc;
  }, []);

  await new DbClassEntregas().insertOne(valuesArray);
  res.status(200).send();
});

// ROTA PARA ATUALIZAR 1 ITEM
rotas.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const columnsArray = [
    "data",
    "idcliente",
    "idmuda",
    "idpedido",
    "veiculo",
    "motorista",
    "entrega",
    "qtdepessoas",
  ];

  const valuesArray = columnsArray.map((col) => body[col]);

  await new DbClassEntregas().updateById(id, valuesArray);
  res.status(200).send({ message: "Entrega atualizada com sucesso" });
});

// ROTA PARA DELETAR UM ITEM
rotas.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await new DbClassEntregas().deleteById(id);
  res.status(200).send({ message: "Entrega excluída com sucesso" });
});

export default rotas;
