const stepTwoController = require('../../../../controllers/productGuideEditor/editor/step2/step2.controller');
const express = require('express');

const productGuidestepTwoRouter = express.Router();

productGuidestepTwoRouter.patch('/product/add-segmenting-targeting', stepTwoController.segmentingTargetingController);
productGuidestepTwoRouter.get('/product/get-segmenting-targeting', stepTwoController.getSegmentingTargetingController);
productGuidestepTwoRouter.patch('/product/add-positioning-raw', stepTwoController.positioningRawDataController);
productGuidestepTwoRouter.post('/product/add-positioning-form-data', stepTwoController.positioningFormDataController);
productGuidestepTwoRouter.patch('/product/add-differentiation-branding', stepTwoController.differentiationBrandingController);

module.exports = productGuidestepTwoRouter;