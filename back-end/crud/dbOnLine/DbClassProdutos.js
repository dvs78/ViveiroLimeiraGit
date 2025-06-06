import DbClass from "./DbClass.js";

class DbClassProdutos extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("produtos", [
        "idProduto",
        "nome",
        "embalagem",
        "producao",
        "pedido",
        "estoque",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "produtos",
        ["idProduto", "nome", "embalagem", "producao", "pedido", "estoque"],
        id
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassProdutos;
