const stepOneController = require('../../../controllers/productGuideEditor/step1/step1.controller');
const express = require('express');

const productGuidestepOneRouter = express.Router();

productGuidestepOneRouter.put('/product/update-product-overview', stepOneController.updateProductOverviewDetail);
productGuidestepOneRouter.post('/product/add-services', stepOneController.addServices);
productGuidestepOneRouter.post('/product/add-main-use', stepOneController.addMainUse);
productGuidestepOneRouter.post('/product/add-gallery', stepOneController.addGallery);

module.exports = productGuidestepOneRouter;