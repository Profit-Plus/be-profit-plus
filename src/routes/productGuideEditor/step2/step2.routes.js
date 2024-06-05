const stepTwoController = require('../../../controllers/productGuideEditor/step2/step2.controller');
const express = require('express');

const productGuidestepTwoRouter = express.Router();

productGuidestepTwoRouter.patch('/product/add-segmenting-targeting', stepTwoController.segmentingTargetingController);
productGuidestepTwoRouter.patch('/product/add-positioning-raw', stepTwoController.positioningRawDataController);
productGuidestepTwoRouter.post('/product/add-positioning-form-data', stepTwoController.positioningFormDataController);
productGuidestepTwoRouter.patch('/product/add-differentiation-branding', stepTwoController.differentiationBrandingController);

module.exports = productGuidestepTwoRouter;