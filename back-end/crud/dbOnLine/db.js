import pg from "pg";

// CONECTAR O nodejs COM O BANCO pg admin
const pool = new pg.Pool({
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_USER: "postgres",
  DB_PASSWORD: "Limao_10",
  DB_DATABASE: "ViveiroLimeira",
});
// const pool = new pg.Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

export default pool;
