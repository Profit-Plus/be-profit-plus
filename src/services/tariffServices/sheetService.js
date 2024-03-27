const { database } = require('../../helpers/utils/db/database');

const productService = {
  async getProducts() {
    return await database.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },

  async getProductById(id) {
    return await database.product.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
      },
    });
  },

  async createProduct(data) {
    return await database.product.create({
      data: {
        name: data.name,
        // Add other fields as necessary
      },
      select: {
        id: true,
        name: true,
      },
    });
  },

  async updateProduct(id, data) {
    return await database.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: data.name,
        // Add other fields as necessary
      },
      select: {
        id: true,
        name: true,
      },
    });
  },

  async deleteProduct(id) {
    return await database.product.delete({
      where: {
        id: parseInt(id),
      },
    });
  },
};

module.exports = productService;
