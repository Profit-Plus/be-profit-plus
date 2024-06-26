const productListService = require('../../../services/productGuideEditor/review/productList.service');
const response = require('../../../helpers/web/webResponses');
const fs = require('fs');

/**
 *  @function getProducts to get all the products from the list if query param null 
 */

function getProductFiles(product_name, product_logo_dir, product_evidence_product_dir, product_evidence_tariff_dir, product_marketing_collateral_dir) {
    const files = {
        product_logo_dir: '',
        product_evidence_product_dir: '',
        product_evidence_tariff_dir: '',
        product_marketing_collateral_dir: ''
    }
    if (product_logo_dir !== 'undefined') {
        const extractedProductLogo = product_logo_dir.split('.')[1];
        files.product_logo_dir = 'http://localhost:3001/product/logo/' + product_name + '.' + extractedProductLogo;
    }
    if (product_evidence_product_dir !== 'undefined') {
        const extractedProductEvidenceProduct = product_evidence_product_dir.split('.')[1];
        files.product_evidence_product_dir = 'http://localhost:3001/product/evidenceproduct/' + product_name + '.' + extractedProductEvidenceProduct;
    }
    if (product_evidence_tariff_dir !== 'undefined') {
        const extractedProductEvidenceTariff = product_evidence_tariff_dir.split('.')[1];
        files.product_evidence_tariff_dir = 'http://localhost:3001/product/evidencetariff/' + product_name + '.' + extractedProductEvidenceTariff;
    }
    if (product_marketing_collateral_dir !== 'undefined') {
        const extractedProductMarketing = product_marketing_collateral_dir.split('.')[1];
        files.product_marketing_collateral_dir = 'http://localhost:3001/product/marketcoll/' + product_name + '.' + extractedProductMarketing;
    }
    return files;
}

async function getProducts(req, res, next) {
    try {
        /* Initialize query param */
        const product = String(req.query.product);
        if (!product.length) {
            /* Get all products from database */
            const products = await productListService.getAllProduct();

            await Promise.all(products.map(async (product) => {
                const files = getProductFiles(product.product_name, product.product_logo_dir, product.product_evidence_product_dir, product.product_evidence_tariff_dir, product.product_marketing_collateral_dir);
                product.product_logo_dir = files.product_logo_dir;
                product.product_evidence_product_dir = files.product_evidence_product_dir;
                product.product_evidence_tariff_dir = files.product_evidence_tariff_dir;
                product.product_marketing_collateral_dir = files.product_marketing_collateral_dir;
            }));
            
            res.status(200).json(response.successResponse('Fetching all products', products));
        } else {
            /* Get product details by UUID  */
            const productDetails = await productListService.getProductByName(product);
            if (!productDetails) {
                res.status(404).json(response.errorResponse('Product not found'));
                return;
            }
            const files = getProductFiles(product.product_name, productDetails.product_logo_dir, productDetails.product_evidence_product_dir, productDetails.product_evidence_tariff_dir, productDetails.product_marketing_collateral_dir);
            productDetails.product_logo_dir = files.product_logo_dir;
            productDetails.product_evidence_product_dir = files.product_evidence_product_dir;
            productDetails.product_evidence_tariff_dir = files.product_evidence_tariff_dir;
            productDetails.product_marketing_collateral_dir = files.product_marketing_collateral_dir;
            
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