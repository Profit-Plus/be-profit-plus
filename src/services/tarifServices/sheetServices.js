const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productService = {
  async getProducts() {
    return await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },

  async getProductById(id) {
    return await prisma.product.findUnique({
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
    return await prisma.product.create({
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
    return await prisma.product.update({
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
    return await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
  },
};

module.exports = productService;
