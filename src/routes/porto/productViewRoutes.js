const express = require('express');
const router = express.Router();
const productGuideController = require('../../controllers/portfolioController/productGuideController');

router.post('/profit/porto/upload-new-product', productGuideController.postNewProduct);
router.post('/profit/porto/upload-main-use', productGuideController.postNewMainUse);
router.post('/profit/porto/upload-product-main-use', productGuideController.postProductMainUse);
router.post('/profit/porto/upload-product-services', productGuideController.postNewProductServices);
router.post('/profit/porto/upload-product-logo', productGuideController.postProductLogo);
router.post('/profit/porto/upload-product-tariff-evidence', productGuideController.postProductTariffEvidence);
router.post('/profit/porto/upload-product-evidence', productGuideController.postProductEvidence);

module.exports = router;