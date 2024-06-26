const productListService = require('../../../services/productGuideEditor/review/productList.service');
const response = require('../../../helpers/web/webResponses');
const fs = require('fs');

/**
 *  @function getProducts to get all the products from the list if query param null 
 */
async function getProducts(req, res, next) {
    try {
        /* Initialize query param */
        const product = String(req.query.product);
        if (!product.length) {
            /* Get all products from database */
            const products = await productListService.getAllProduct();
            res.status(200).json(response.successResponse('Fetching all products', products));
        } else {
            /* Get product details by UUID  */
            const productDetails = await productListService.getProductByName(product);
            if (!productDetails) {
                res.status(404).json(response.errorResponse('Product not found'));
                return;
            }
            if (productDetails.product_logo_dir !== 'undefined') {
                const extractedProductLogo = productDetails.product_logo_dir.split('.')[1];
                productDetails.product_logo_dir = 'http://localhost:3001/product/logo/' + productDetails.product_name + '.' + extractedProductLogo;
            }
            if (productDetails.product_playbook_dir !== 'undefined') {
                const extractedProductPlaybook = productDetails.product_playbook_dir.split('.')[1];
                productDetails.product_playbook_dir = 'http://localhost:3001/product/playbook/' + productDetails.product_name + '.' + extractedProductPlaybook;
            }
            if (productDetails.product_marketing_collateral_dir !== 'undefined') {
                const extractedProductMarketing = productDetails.product_marketing_collateral_dir.split('.')[1];
                productDetails.product_marketing_collateral_dir = 'http://localhost:3001/product/marketing/' + productDetails.product_name + '.' + extractedProductMarketing;
            }
            res.status(200).json(response.successResponse('Fetching all products', productDetails));
        }
        
    } catch (error) {
        res.status(500).json(response.errorResponse('Failed to fetch datas'));
        next(error);
    }
}

async function getPicture(req, res, next) {
    try {
        const productName = String(req.params.id);
        const productDetails = await productListService.getProductByName(productName);
        if (!productDetails) {
            res.status(404).json(response.errorResponse('Product not found'));
            return;
        }
        const picture = productDetails.product_logo_dir;
        const fileExist = fs.existsSync(picture)
        console.log(picture, fileExist)
        if (!fileExist) {
            res.status(404).json(response.errorResponse('File not found'));
            return;
        }
        res.status(200).sendFile(picture);
    } catch (error) {
        res.status(500).json(response.errorResponse('Failed to fetch picture'));
        next(error);
    }
}

module.exports = {
    getProducts,
    getPicture
}