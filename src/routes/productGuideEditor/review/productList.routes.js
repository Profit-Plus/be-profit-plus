const productListController = require('../../../controllers/productGuideEditor/review/productList.controller');
const express = require('express');

const productListRouter = express.Router();

productListRouter.get('/product/get-products', productListController.getProducts);

module.exports = productListRouter;