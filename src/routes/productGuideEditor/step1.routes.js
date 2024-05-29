const miscController = require('../../controllers/productGuideEditor/misc/misc.controller');
const stepOneController = require('../../controllers/productGuideEditor/step1.controller');
const express = require('express');

const stepOneRouter = express.Router();

stepOneRouter.put('/profitplus/product/update-product-overview', stepOneController.updateProductOverviewDetail);
stepOneRouter.post('/profitplus/product/add-new-product', stepOneController.addNewProduct);
stepOneRouter.post('/profitplus/product/add-services', stepOneController.addServices);
stepOneRouter.post('/profitplus/product/add-main-use', stepOneController.addMainUse);
stepOneRouter.post('/profitplus/product/add-gallery', stepOneController.addGallery);

stepOneRouter.post('/profitplus/product/add-new-taxonomy', miscController.addNewTaxonomy);


module.exports = stepOneRouter;