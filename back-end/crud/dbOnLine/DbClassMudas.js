import DbClass from "./DbClass.js";

class DbClassMudas extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("mudas", [
        "id",
        "ano",
        "semente",
        "embalagem",
        "cultivar",
        "producao",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "mudas",
        ["id", "ano", "semente", "embalagem", "cultivar", "producao"],
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
        "mudas",
        ["ano", "semente", "embalagem", "cultivar", "producao"],
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  async updateById(id, valuesArray) {
    try {
      await super.updateById(
        "mudas",
        ["ano", "semente", "embalagem", "cultivar", "producao"],
        id,
        valuesArray
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      await super.deleteById("mudas", id);
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassMudas;
