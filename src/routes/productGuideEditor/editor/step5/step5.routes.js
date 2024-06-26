const stepFiveController = require('../../../../controllers/productGuideEditor/editor/step5/step5.controller');
const express = require('express');

const productGuidestepFiveRouter = express.Router();

productGuidestepFiveRouter.post('/product/add-product-tariffing', stepFiveController.addProductTariffing);

module.exports = productGuidestepFiveRouter;