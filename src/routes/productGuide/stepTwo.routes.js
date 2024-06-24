const stepTwoController = require('../../controllers/productGuide/stepTwo');

const express = require('express');
const stepTwoRouter = express.Router();

/**
 *  Step two API Router
 */

stepTwoRouter.put('/profitplus/porto/add-market-potential', stepTwoController.updateProductMarketPotential);
stepTwoRouter.put('/profitplus/porto/update-product-positioning-indicators', stepTwoController.updateProductPositioningIndicator);
stepTwoRouter.put('/profitplus/porto/update-product-positioning-indicators', stepTwoController.updateProductPositioningIndicator);

stepTwoRouter.post('/profitplus/porto/create-new-product-stpdb', stepTwoController.createStpdbProduct);
stepTwoRouter.post('/profitplus/porto/add-segmenting-targeting', stepTwoController.createSegmentingTargeting);
stepTwoRouter.post('/profitplus/porto/add-positioning-picture', stepTwoController.uploadProductPositioningPictureDetails);

module.exports = stepTwoRouter;