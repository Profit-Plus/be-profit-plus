const productListService = require('../../../services/productGuideEditor/review/productList.service');
const response = require('../../../helpers/web/webResponses');

/**
 *  @function getAllProduct to get all the products from the list 
 */
async function getAllProduct(req, res, next) {
    try {
        /* Get all products from database */
        const products = await productListService.getAllProduct();
        const totalProduct = await productListService.countProduct();
        res.status(200).json(response.successResponsePage('Fetching all products', null, null, totalProduct, products));

    } catch (error) {
        res.status(200).json(response.errorResponse('Failed to fetch datas'));
        next(error);
    }
}

module.exports = {
    getAllProduct
}