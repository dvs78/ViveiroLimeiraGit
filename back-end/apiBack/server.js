// import "dotenv/config";
// import pool from "../crud/dbOnLine/db.js";
// import express from "express";

// const PORTA = 3000;
// const server = express();

// // CRIAR A ROTA GET QUE IRÁ COMUNICAR O DB COM SERVIDOR
// server.get("/clientes", async (req, res) => {
//   const result = await new DbClass().getAll("clientes");
//   res.status(200).send(result);
// });

// console.log((await pool.query("SELECT * FROM clientes")).rows);

// server.listen(PORTA, () => {
//   console.log(`API está online, na porta ${PORTA}!!!`);
// });

// import "dotenv/config";
import express from "express";
import cors from "cors";
import rotasClientes from "../crud/rotas/rotasClientes.js";
import rotasCarrinho from "../crud/rotas/rotasCarrinho.js";
import rotasMudas from "../crud/rotas/rotasMudas.js";
import rotasPedidos from "../crud/rotas/rotasPedidos.js";
import rotasEntregas from "../crud/rotas/rotasEntregas.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

server.use("/api/carrinho", rotasCarrinho);
server.use("/api/clientes", rotasClientes);
server.use("/api/mudas", rotasMudas);
server.use("/api/pedidos", rotasPedidos);
server.use("/api/entregas", rotasEntregas);

server.use(express.static(path.join(__dirname, "../../front-end/dist")));

server.get("*any", (req, res) => {
  // Ignora rotas da API
  if (req.originalUrl.startsWith("/api")) return res.sendStatus(404);
  res.sendFile(path.join(__dirname, "../../front-end/dist/index.html"));
});

// server.get("*any", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../front-end/dist/index.html"));
// });

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
