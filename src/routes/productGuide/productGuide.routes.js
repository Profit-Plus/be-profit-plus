const productGuideController = require('../../controllers/productGuideController/stepOne');

const express = require('express');
const productGuideRouter = express.Router();

productGuideRouter.post('/profitplus/porto/create-new-product', productGuideController.createNewProduct);
productGuideRouter.post('/profitplus/porto/upload-product-gallery', productGuideController.uploadProductGallery);
productGuideRouter.post('/profitplus/porto/upload-file', productGuideController.uploadProductFile);
productGuideRouter.post('/profitplus/porto/add-new-taxonomy', productGuideController.addNewProductTaxonomy);
productGuideRouter.post('/profitplus/porto/add-new-unit', productGuideController.addNewProductUnit);
productGuideRouter.post('/profitplus/porto/add-new-services', productGuideController.addProductServices);
productGuideRouter.post('/profitplus/porto/add-new-mainuse', productGuideController.addProductMainUse);

productGuideRouter.get('/profitplus/porto/get-taxonomy', productGuideController.getProductTaxonomy);
productGuideRouter.get('/profitplus/porto/get-unit', productGuideController.getProductUnit);

productGuideRouter.put('/profitplus/porto/update-product-details', productGuideController.updateProductDetail);

module.exports = productGuideRouter;