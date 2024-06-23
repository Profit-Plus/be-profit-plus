const express = require('express');
const router = express.Router();
const dashboardSSOController = require('../../controllers/tariffControllers/dashboardSSOController');

router.get('/Sso', dashboardSSOController.getSso);
router.put('/Sso/:id', dashboardSSOController.updateSso);

router.post('/Sso', dashboardSSOController.createSso);
// router.get('/total-product', dashboardSSOController.getTotalProduct);
// router.get('/last-product', dashboardSSOController.lastProduct);
// router.get('/total-type-by-product/:productId', dashboardSSOController.getTotalTypeByProductId);
// router.get('/total-category-by-product/:productId', dashboardSSOController.getTotalCategoryByProductId);
// router.get('/total-product-last-month', dashboardSSOController.getTotalProductLastMonth);
// router.get('/test', dashboardSSOController.queryParamsTest);

module.exports = router;

// Path: src/routes/tariffRoutes/dashboardOverviewRoute.js