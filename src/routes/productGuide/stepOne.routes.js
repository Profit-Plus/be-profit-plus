const stepOneController = require('../../controllers/productGuide/stepOne');
const requestCasing = require('../../middlewares/reqBodyCasing/requestCasing.middleware');

const express = require('express');
const stepOneRouter = express.Router();

/**
 *  Step One API Router
 */
stepOneRouter.post('/profitplus/porto/create-new-product', requestCasing.lowerCase, stepOneController.createNewProduct);
stepOneRouter.post('/profitplus/porto/upload-product-gallery', stepOneController.uploadProductGallery);
stepOneRouter.post('/profitplus/porto/upload-file', stepOneController.uploadProductFile);
stepOneRouter.post('/profitplus/porto/add-new-taxonomy', requestCasing.upperCase, stepOneController.addNewProductTaxonomy);
stepOneRouter.post('/profitplus/porto/add-new-unit', requestCasing.upperCase,stepOneController.addNewProductUnit);
stepOneRouter.post('/profitplus/porto/add-new-services', stepOneController.addProductServices);
stepOneRouter.post('/profitplus/porto/add-new-mainuse', stepOneController.addProductMainUse);

stepOneRouter.get('/profitplus/porto/get-taxonomy', stepOneController.getProductTaxonomy);
stepOneRouter.get('/profitplus/porto/get-unit', stepOneController.getProductUnit);

stepOneRouter.put('/profitplus/porto/update-product-details', stepOneController.updateProductDetail);

/**
 *  Export route to module
 */
module.exports = stepOneRouter;