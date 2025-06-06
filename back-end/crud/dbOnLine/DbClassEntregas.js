import DbClass from "./DbClass.js";

class DbClassEntregas extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("entregas", [
        "id",
        "data",
        "idcliente",
        "idmuda",
        "idpedido",
        "veiculo",
        "motorista",
        "entrega",
        "qtdepessoas",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "entregas",
        [
          "data",
          "idcliente",
          "idmuda",
          "idpedido",
          "veiculo",
          "motorista",
          "entrega",
          "qtdepessoas",
        ],
        id
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async insertOne(valuesArray) {
    try {
      await super.insertOne(
        "entregas",
        [
          "data",
          "idcliente",
          "idmuda",
          "idpedido",
          "veiculo",
          "motorista",
          "entrega",
          "qtdepessoas",
        ],
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  async updateById(id, valuesArray) {
    try {
      await super.updateById(
        "entregas",
        [
          "data",
          "idcliente",
          "idmuda",
          "idpedido",
          "veiculo",
          "motorista",
          "entrega",
          "qtdepessoas",
        ],
        id,
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      await super.deleteById("entregas", id);
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassEntregas;
