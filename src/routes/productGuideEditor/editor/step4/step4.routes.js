const stepFourController = require('../../../../controllers/productGuideEditor/editor/step4/step4.controller');
const express = require('express');

const productGuidestepFourRouter = express.Router();

productGuidestepFourRouter.post('/product/add-use-case', stepFourController.addProductUseCase);
productGuidestepFourRouter.get('/product/get-use-case', stepFourController.getProductUseCase);

module.exports = productGuidestepFourRouter;