const productListService = require('../../../services/productGuideEditor/review/productList.service');
const response = require('../../../helpers/web/webResponses');

async function getAllProduct(req, res, next) {
    try {
        /* Get all products from database */
        const products = await productListService.getAllProduct();
        res.status(200).json(response.successResponse('Fetching all products', products));

    } catch (error) {
        res.status(200).json(response.errorResponse('Failed to fetch datas'));
    }
}

module.exports = {
    getAllProduct
}