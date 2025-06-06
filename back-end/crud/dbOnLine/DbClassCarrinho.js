import DbClass from "./DbClass.js";

class DbClassCarrinho extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("carrinho", [
        "id",
        "idPedido",
        "ano",
        "cultivar",
        "semente",
        "embalagem",
        "precoMuda",
        "desconto",
        "precoMudaDesconto",
        "pedido",
        "precoMudaTotal",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "carrinho",
        [
          "id",
          "idPedido",
          "ano",
          "cultivar",
          "semente",
          "embalagem",
          "precoMuda",
          "desconto",
          "precoMudaDesconto",
          "pedido",
          "precoMudaTotal",
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
        "carrinho",
        [
          "id",
          "idPedido",
          "ano",
          "cultivar",
          "semente",
          "embalagem",
          "precoMuda",
          "desconto",
          "precoMudaDesconto",
          "pedido",
          "precoMudaTotal",
        ],
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      const results = await super.deleteAll("carrinho");
      return results;
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassCarrinho;
