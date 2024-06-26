const miscController = require('../../../../controllers/productGuideEditor/editor/misc/misc.controller');
const express = require('express');

const productGuideMiscRouter = express.Router();

productGuideMiscRouter.post('/product/add-new-taxonomy', miscController.addNewTaxonomy);

module.exports = productGuideMiscRouter;