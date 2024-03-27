const productService = require('../../services/tariffServices/sheetService');
const { successResponse, errorResponse } = require('../../helpers/web/webResponses');

const productController = {
  async getProducts(req, res) {
    try {
      const products = await productService.getProducts();
      res.json(successResponse('Products retrieved successfully', products));
    } catch (error) {
      res.status(500).json(errorResponse('Internal Server Error'));
    }
  },

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json(errorResponse('Product not found'));
      }
      res.json(successResponse('Product retrieved successfully', product));
    } catch (error) {
      res.status(500).json(errorResponse('Internal Server Error'));
    }
  },

  async createProduct(req, res) {
    const data = req.body;
    try {
      const product = await productService.createProduct(data);
      res.status(201).json(successResponse('Product created successfully', product));
    } catch (error) {
      res.status(500).json(errorResponse('Internal Server Error'));
    }
  },

  async updateProduct(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const product = await productService.updateProduct(id, data);
      res.json(successResponse('Product updated successfully', product));
    } catch (error) {
      res.status(500).json(errorResponse('Internal Server Error'));
    }
  },

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      await productService.deleteProduct(id);
      res.json(successResponse('Product deleted successfully'));
    } catch (error) {
      res.status(500).json(errorResponse('Internal Server Error'));
    }
  },
};

module.exports = productController;
