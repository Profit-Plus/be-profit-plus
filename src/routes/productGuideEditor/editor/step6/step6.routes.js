const stepSixController = require('../../../../controllers/productGuideEditor/editor/step6/step6.controller');
const express = require('express');

const productGuideEditorStep6Router = express.Router();

productGuideEditorStep6Router.post('/product/update-product-readiness', stepSixController.addProductReadinesStatus);

module.exports = productGuideEditorStep6Router;