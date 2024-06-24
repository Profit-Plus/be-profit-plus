const express = require('express');
const router = express.Router();
const dashboardSSOController = require('../../controllers/tariffControllers/dashboardSSOController');

router.get('/sso', dashboardSSOController.getSso);
router.get('/sheet', dashboardSSOController.getSheet);
router.get('/user', dashboardSSOController.getUser);
router.get('/unit', dashboardSSOController.getUnit);

router.put('/sso/:id', dashboardSSOController.updateSso);

router.post('/sso', dashboardSSOController.createSso);
// router.get('/total-product', dashboardSSOController.getTotalProduct);
// router.get('/last-product', dashboardSSOController.lastProduct);
// router.get('/total-type-by-product/:productId', dashboardSSOController.getTotalTypeByProductId);
// router.get('/total-category-by-product/:productId', dashboardSSOController.getTotalCategoryByProductId);
// router.get('/total-product-last-month', dashboardSSOController.getTotalProductLastMonth);
// router.get('/test', dashboardSSOController.queryParamsTest);

module.exports = router;

// Path: src/routes/tariffRoutes/dashboardOverviewRoute.js