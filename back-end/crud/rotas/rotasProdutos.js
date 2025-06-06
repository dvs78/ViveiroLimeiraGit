import { Router } from "express";
import DbClassProdutos from "../dbOnLine/DbClassProdutos.js";

const rotas = Router();

// ROTA PARA PEGAR TODOS OS PRODUTOS
rotas.get("/", async (req, res) => {
  const result = await new DbClassProdutos().getAll();
  res.status(200).send(result);
});

// ROTA PARA PEGAR 1 PRODUTO
rotas.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new DbClassProdutos().getById(id);
  res.status(200).send(result);
});

export default rotas;
