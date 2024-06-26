const productListController = require('../../../controllers/productGuideEditor/review/productList.controller');
const express = require('express');

const productListRouter = express.Router();

productListRouter.get('/product/get-products', productListController.getProducts);
productListRouter.get('/product/picture/:id', productListController.getPicture);

module.exports = productListRouter;