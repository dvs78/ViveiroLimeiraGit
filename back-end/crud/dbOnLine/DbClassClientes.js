import DbClass from "./DbClass.js";

class DbClassClientes extends DbClass {
  async getAll() {
    try {
      const results = await super.getAll("clientes", [
        "id",
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
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await super.getById(
        "clientes",
        [
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
        "clientes",
        [
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
        "clientes",
        [
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
      await super.deleteById("clientes", id);
    } catch (error) {
      throw error;
    }
  }
}

export default DbClassClientes;
