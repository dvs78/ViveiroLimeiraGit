import DbClass from "./DbClass.js";

class DbClassPedidos extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("pedidos", [
        "id",
        "idcliente",
        "idmuda",
        "data",
        "precomuda",
        "desconto",
        "precomudadesconto",
        "pedido",
        "precomudatotal",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "pedidos",
        [
          "idcliente",
          "idmuda",
          "data",
          "precomuda",
          "desconto",
          "precomudadesconto",
          "pedido",
          "precomudatotal",
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
        "pedidos",
        [
          "idcliente",
          "idmuda",
          "data",
          "precomuda",
          "desconto",
          "precomudadesconto",
          "pedido",
          "precomudatotal",
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
        "pedidos",
        [
          "idcliente",
          "idmuda",
          "data",
          "precomuda",
          "desconto",
          "precomudadesconto",
          "pedido",
          "precomudatotal",
        ],
        id,
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  // async put(cpf) {
  //   try {
  //     await super.put("clientes", cpf);
  //     // return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async delete(id) {
  //   try {
  //     await super.delete("clientes", id);
  //     // return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async deleteById(id) {
    try {
      await super.deleteById("pedidos", id);
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassPedidos;
