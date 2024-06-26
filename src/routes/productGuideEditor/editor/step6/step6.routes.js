const stepSixController = require('../../../../controllers/productGuideEditor/editor/step6/step6.controller');
const express = require('express');

const productGuideEditorStepSixRouter = express.Router();

productGuideEditorStepSixRouter.post('/product/update-product-readiness', stepSixController.addProductReadinesStatus);
productGuideEditorStepSixRouter.get('/product/get-product-readiness', stepSixController.getProductReadinessStatus);

module.exports = productGuideEditorStepSixRouter;