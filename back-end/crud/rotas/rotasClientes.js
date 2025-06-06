import { Router } from "express";
import DbClassClientes from "../dbOnLine/DbClassClientes.js";

const rotas = Router();

// ROTA PARA PEGAR TODOS OS CLIENTES
// rotas.get("/", async (req, res) => {
//   const result = await new DbClassClientes().getAll();
//   res.status(200).send(result);
// });
rotas.get("/", async (req, res) => {
  try {
    const result = await new DbClassClientes().getAll();
    res.status(200).send(result);
  } catch (erro) {
    console.error("❌ Erro na rota GET /clientes:", erro.message);
    res.status(500).send({ erro: "Erro ao buscar clientes" });
  }
});

// ROTA PARA PEGAR 1 CLIENTE
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassClientes().getById(id);
  res.status(200).send(result);
});

// ROTA PARA INSERIR 1 CLIENTE
rotas.post("/", async (req, res) => {
  const { body } = req;
  const columnsArray = [
    "nome",
    "sobrenome",
    "nomecompleto",
    "telefone",
    "email",
    "cpf",
    "inscricaoestadual",
    "rua",
    "bairro",
    "cep",
    "cidade",
    "estado",
  ];
  // O método .reduce() é usado em arrays para reduzir seus elementos a um único valor, aplicando uma função acumuladora a cada item do array.
  const valuesArray = columnsArray.reduce((acc, columnName) => {
    acc.push(body[columnName]);
    return acc;
  }, []);

  await new DbClassClientes().insertOne(valuesArray);
  res.status(200).send();
});

// ROTA PARA ATUALIZAR UM CLIENTE
rotas.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const columnsArray = [
    "nome",
    "sobrenome",
    "nomecompleto",
    "telefone",
    "email",
    "cpf",
    "inscricaoestadual",
    "rua",
    "bairro",
    "cep",
    "cidade",
    "estado",
  ];

  const valuesArray = columnsArray.map((col) => body[col]);

  await new DbClassClientes().updateById(id, valuesArray);
  res.status(200).send({ message: "Cliente atualizado com sucesso" });
});

// ROTA PARA DELETAR UM CLIENTE
rotas.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await new DbClassClientes().deleteById(id);
  res.status(200).send({ message: "Cliente excluído com sucesso" });
});

export default rotas;
