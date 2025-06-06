import pool from "./db.js";

class DbClass {
  // PEGAR TUDO
  async getAll(tabela, colunas) {
    try {
      const results = (
        await pool.query(`SELECT ${colunas.join()} FROM ${tabela}`)
      ).rows;
      return results;
    } catch (error) {
      throw error;
    }
  }

  // PEGAR PELO ID
  async getById(tabela, colunas, id) {
    try {
      const querytext = `SELECT ${colunas.join()} FROM ${tabela} WHERE id = $1`; // Proteger id
      const result = (await pool.query(querytext, [id])).rows[0];
      return result;
    } catch (error) {
      throw error;
    }
  }

  // INSERIR
  async insertOne(tabela, columnsArray, valuesArray) {
    const cliente = await pool.connect(); // Criar uma conexão com o banco de dados
    try {
      // let flagsString = "";
      // Opção de fazer com for
      // for (let i = 1; i < columnsArray.length; i++) {
      //   flagsString += `$${i},`;
      // }
      // '$1,'
      // '$1, $2,'
      // flagsString += `$${columnsArray.length}`;
      // '$1, $2, $3'

      // Opção sem o for
      let flagsArray = Array.from(new Array(columnsArray.length).keys()).map(
        (el) => `$${el + 1}`
      );
      const queryText = `INSERT INTO ${tabela} (${columnsArray.join()}) VALUES(${flagsArray.join()})`;
      await cliente.query("BEGIN TRANSACTION"); // Rodar a transaction
      await cliente.query(queryText, valuesArray); // Inserir
      await cliente.query("COMMIT"); // Comitar, validar
    } catch (error) {
      await cliente.query("ROLLBACK"); // Se der algum problema, desfazer
      throw error;
    } finally {
      cliente.release(); // largar a conexão com banco de dados
    }
  }

  // EDITAR
  async updateById(tabela, columnsArray, id, valuesArray) {
    const cliente = await pool.connect();
    try {
      const setClause = columnsArray
        .map((col, idx) => `${col} = $${idx + 1}`)
        .join(", ");

      const queryText = `UPDATE ${tabela} SET ${setClause} WHERE id = $${
        columnsArray.length + 1
      }`;

      await cliente.query("BEGIN");
      await cliente.query(queryText, [...valuesArray, id]);
      await cliente.query("COMMIT");
    } catch (error) {
      await cliente.query("ROLLBACK");
      throw error;
    } finally {
      cliente.release();
    }
  }

  // DELETAR POR ID
  async deleteById(tabela, id) {
    try {
      const queryText = `DELETE FROM ${tabela} WHERE id = $1`;
      await pool.query(queryText, [id]);
    } catch (error) {
      throw error;
    }
  }

  // DELETAR TUDO
  async deleteAll(tabela) {
    try {
      const queryText = `DELETE FROM ${tabela}`;
      await pool.query(queryText);
    } catch (error) {
      throw error;
    }
  }
}

export default DbClass;
