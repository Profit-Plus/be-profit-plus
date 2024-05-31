const miscController = require('../../../controllers/productGuideEditor/misc/misc.controller');
const express = require('express');

const productGuideMiscRouter = express.Router();

productGuideMiscRouter.post('/profitplus/product/add-new-taxonomy', miscController.addNewTaxonomy);

module.exports = productGuideMiscRouter;