import { Router } from "express";
import DbClassMudas from "../dbOnLine/DbClassMudas.js";

const rotas = Router();

// ROTA PARA PEGAR TODAS AS MUDAS
rotas.get("/", async (req, res) => {
  const result = await new DbClassMudas().getAll();
  res.status(200).send(result);
});

// ROTA PARA PEGAR 1 MUDA
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassMudas().getById(id);
  res.status(200).send(result);
});

// ROTA PARA INSERIR 1 MUDA
rotas.post("/", async (req, res) => {
  const { body } = req;
  const columnsArray = ["ano", "semente", "embalagem", "cultivar", "producao"];
  // O método .reduce() é usado em arrays para reduzir seus elementos a um único valor, aplicando uma função acumuladora a cada item do array.
  const valuesArray = columnsArray.reduce((acc, columnName) => {
    acc.push(body[columnName]);
    return acc;
  }, []);

  await new DbClassMudas().insertOne(valuesArray);
  res.status(200).send();
});

// ROTA PARA ATUALIZAR UMA MUDA
rotas.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const columnsArray = ["ano", "semente", "embalagem", "cultivar", "producao"];

  const valuesArray = columnsArray.map((col) => body[col]);

  await new DbClassMudas().updateById(id, valuesArray);
  res
    .status(200)
    .send({ message: "Produção de mudas atualizada com sucesso!!!" });
});

// ROTA PARA DELETAR UM CLIENTE
rotas.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await new DbClassMudas().deleteById(id);
  res
    .status(200)
    .send({ message: "Produção de mudas excluída com sucesso!!!" });
});

export default rotas;
