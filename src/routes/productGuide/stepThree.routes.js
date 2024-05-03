const stepThreeController = require('../../controllers/productGuide/stepThree');

const express = require('express');
const stepThreeRouter = express.Router();

/**
 *  Step three API Router
 */
stepThreeRouter.post('/profitplus/porto/add-partnership-gtm-details', stepThreeController.addPartnershipGtmHostDetails);
stepThreeRouter.post('/profitplus/porto/add-partnership-gtm-file', stepThreeController.uploadPartnershipGtmHostFile);
stepThreeRouter.post('/profitplus/porto/update-product-location', stepThreeController.updateProductLocation);
stepThreeRouter.post('/profitplus/porto/add-iblobl-gtm-details', stepThreeController.addIblOblGtmHost);
stepThreeRouter.post('/profitplus/porto/add-product-suppliers', stepThreeController.addProductSupplier);
stepThreeRouter.post('/profitplus/porto/add-business-process', stepThreeController.addBusinessProcess);
stepThreeRouter.post('/profitplus/porto/add-internal-information', stepThreeController.addInternalInformation);
stepThreeRouter.post('/profitplus/porto/add-external-information', stepThreeController.addExternalInformation);
stepThreeRouter.post('/profitplus/porto/add-product-organization', stepThreeController.addProductOrganization);
stepThreeRouter.post('/profitplus/porto/add-product-management-system', stepThreeController.addProductManagementSystem);

module.exports = stepThreeRouter;