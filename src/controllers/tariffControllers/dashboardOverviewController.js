// controllers/tariffControllers/masterPackage/masterPackageController.js

const dashboardOverviewService = require('../../services/tariffServices/dashboardOverviewService');
const webResponses = require('../../helpers/web/webResponses');

async function getProducts(req, res) {
    try {
        const data = await dashboardOverviewService.getProducts();
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getTotalProduct(req, res) {
    try {
        const data = await dashboardOverviewService.getTotalProduct();
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function lastProduct(req, res) {
    try {
        const data = await dashboardOverviewService.lastProduct();
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getTotalTypeByProductId(req, res) {
    const productId = req.params.productId;
    try {
        const data = await dashboardOverviewService.getTotalTypeByProductId(parseInt(productId));
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getTotalCategoryByProductId(req, res) {
    const productId = req.params.productId;
    try {
        const data = await dashboardOverviewService.getTotalCategoryByProductId(parseInt(productId));
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getTotalProductLastMonth(req, res) {
    try {
        const data = await dashboardOverviewService.getTotalProductLastMonth();
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

module.exports = {
    getProducts,
    getTotalProduct,
    lastProduct,
    getTotalTypeByProductId,
    getTotalCategoryByProductId,
    getTotalProductLastMonth,
};
// Path: src/controllers/tariffControllers/masterPackageController.js