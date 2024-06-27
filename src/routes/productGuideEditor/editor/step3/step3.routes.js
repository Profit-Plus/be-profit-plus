const stepThreeController = require('../../../../controllers/productGuideEditor/editor/step3/step3.controller');
const express = require('express');

const productGuidestepThreeRouter = express.Router();

productGuidestepThreeRouter.post('/product/add-operating-model-details', stepThreeController.updateOperatingModelDetails);
productGuidestepThreeRouter.post('/product/add-operating-model-gtm-host', stepThreeController.addOperatingModelGtmHost);
productGuidestepThreeRouter.get('/product/get-operating-model-details', stepThreeController.getOperatingModelDetails);
productGuidestepThreeRouter.get('/product/get-operating-model-gtm-host', stepThreeController.getOperatingModelGtmHost);

module.exports = productGuidestepThreeRouter;