const stepOneController = require('../../../../controllers/productGuideEditor/editor/step1/step1.controller');
const express = require('express');

const productGuidestepOneRouter = express.Router();

productGuidestepOneRouter.put('/product/update-product-overview', stepOneController.updateProductOverviewDetail);
productGuidestepOneRouter.post('/product/add-services', stepOneController.addServices);
productGuidestepOneRouter.post('/product/add-main-use', stepOneController.addMainUse);
productGuidestepOneRouter.get('/product/get-detail', stepOneController.getDetail);
productGuidestepOneRouter.post('/product/add-gallery', stepOneController.setGallery);

module.exports = productGuidestepOneRouter;