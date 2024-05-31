const stepOneController = require('../../../controllers/productGuideEditor/step1/step1.controller');
const express = require('express');

const productGuidestepOneRouter = express.Router();

productGuidestepOneRouter.put('/profitplus/product/update-product-overview', stepOneController.updateProductOverviewDetail);
productGuidestepOneRouter.post('/profitplus/product/add-services', stepOneController.addServices);
productGuidestepOneRouter.post('/profitplus/product/add-main-use', stepOneController.addMainUse);
productGuidestepOneRouter.post('/profitplus/product/add-gallery', stepOneController.addGallery);

module.exports = productGuidestepOneRouter;