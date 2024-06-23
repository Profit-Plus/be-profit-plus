const productListService = require('../../../services/productGuideEditor/review/productList.service');
const response = require('../../../helpers/web/webResponses');

/**
 *  @function getProducts to get all the products from the list if query param null 
 */
async function getProducts(req, res, next) {
    try {
        /* Initialize query param */
        const productId = String(req.query.product);

        if (!productId.length) {
            /* Get all products from database */
            const products = await productListService.getAllProduct();
            res.status(200).json(response.successResponse('Fetching all products', products));
        } else {
            /* Get product details by UUID  */
            const productDetails = await productListService.getProductById(productId);
            res.status(200).json(response.successResponse('Fetching all products', productDetails));
        }
        

    } catch (error) {
        res.status(500).json(response.errorResponse('Failed to fetch datas'));
        next(error);
    }
}

module.exports = {
    getProducts
}