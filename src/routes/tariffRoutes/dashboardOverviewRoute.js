const express = require('express');
const router = express.Router();
const dashboardOverviewController = require('../../controllers/tariffControllers/dashboardOverviewController');

router.get('/products', dashboardOverviewController.getProducts);
router.get('/total-product', dashboardOverviewController.getTotalProduct);
router.get('/last-product', dashboardOverviewController.lastProduct);
router.get('/total-type-by-product/:productId', dashboardOverviewController.getTotalTypeByProductId);
router.get('/total-category-by-product/:productId', dashboardOverviewController.getTotalCategoryByProductId);
router.get('/total-product-last-month', dashboardOverviewController.getTotalProductLastMonth);

module.exports = router;

// Path: src/routes/tariffRoutes/dashboardOverviewRoute.js