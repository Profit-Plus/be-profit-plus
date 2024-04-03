const productGuideService = require('../../services/portofolio/productViewServices');
const checkForNullValues = require('../../validators/checkForNullValues');
const webResponses = require('../../helpers/web/webResponses');

const path = require('path');
const formidable = require('formidable');
const mv = require('mv');

/**
 *  API to post new product to database
 *  endpoint: /porto/upload-new-product
 *  body:  
 *      productDetails: {productName, productDescription, productYear, productTaxonomy, productFeatures},
        productFiles: {productEvidenceDir, productTariffEvidenceDir, productLogiDir, productPlaybookDir},
        productLinks: {productProfileLink, productWebsiteLabel}
*/
async function postNewProduct(req, res, next) {
    try {
        /* Declare input as a request body */
        const requestBody = req.body; 

        /* Check for null values on request body - implement checkForNullValues */
        if (checkForNullValues(req)) {
            res.status(400).json(webResponses.errorResponse('Invalid request! Request body cannot contains null value'));
            throw new Error('Null value in request body!');
        } else {
            /* Post product to database */
            const param = {
                product_logo_dir: requestBody.file.path,
                product_name: requestBody.product_name
            }
            const newProduct = await productGuideService.addNewProduct(param);
            res.status(200).json(webResponses.successResponse('New Product added!', newProduct));
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-main-use
 *  @param fileImage
 *  @param fileName
*/
async function postProductLogo(req, res, next) {
    try {
        /* Make the instance of formidable */
        const form = new formidable.IncomingForm();

        /* Parse file to server */
        form.parse(req, function(error, fields, files) {
            const { fileName } = fields;
            const oldPath = files.image[0].filepath;
            const newPath = path.join('uploads', 'productLogo') + '/' + fileName + '.jpg';

            mv(oldPath, newPath, function (error) {
                if (error) {
                    throw error;
                }

                res.status(200).json(webResponses.successResponse('File uploaded successfully'));
            });
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-main-use
 *  @param tariffFile
 *  @param fileName
*/
async function postProductTariffEvidence(req, res,next) {
    /* Make the instance of formidable */
    const form = new formidable.IncomingForm();

    /* Parse file to server */
    form.parse(req, function(error, fields, files) {
        const { fileName } = fields;
        const oldPath = files.tariffFile[0].filepath;
        const newPath = path.join('uploads', 'productTariffEvidence') + '/' + fileName + '.pdf';

        mv(oldPath, newPath, function (error) {
            if (error) {
                throw error;
            }

            res.status(200).json(webResponses.successResponse('File uploaded successfully'));
        });
    });
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-main-use
 *  @param productFile
 *  @param fileName
*/
async function postProductEvidence(req, res, next) {
    /* Make the instance of formidable */
    const form = new formidable.IncomingForm();

    /* Parse file to server */
    form.parse(req, function(error, fields, files) {
        const { fileName } = fields;
        const oldPath = files.productFile[0].filepath;
        const newPath = path.join('uploads', 'productEvidence') + '/' + fileName + '.pdf';

        mv(oldPath, newPath, function (error) {
            if (error) {
                throw error;
            }

            res.status(200).json(webResponses.successResponse('File uploaded successfully'));
        });
    });
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-main-use
 *  @param main_use_name
*/
async function postNewMainUse(req, res, next) {
    try {
        /* Declare input as a request body */
        const requestBody = req.body;

        /* Check for null values on request body - implement checkForNullValues */
        if (checkForNullValues(req)) {
            res.status(400).json(webResponses.errorResponse('Invalid request! Request body cannot contains null value'));
            throw new Error('Null value in request body!');
        } else {
            const newProduct = await productGuideService.addNewMainUse(requestBody);
            res.status(200).json(webResponses.successResponse('New main use added!', newProduct));
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-main-use
 *  Description:
 *      This API used to post main uses of a product since one product can has multiple use case
 *  @param product_name
 *  @param main_use_name
*/
async function postProductMainUse(req, res, next) {
    try {
        /* Declare input as a request body */
        const requestBody = req.body;
        
        /* Check for null values on request body - implement checkForNullValues */
        if (checkForNullValues(req)) {
            res.status(400).json(webResponses.errorResponse('Invalid request! Request body cannot contains null value'));
            throw new Error('Null value in request body!');
        } else {
            /* Store request body to database */
            const newProductMainUse = await productGuideService.addProductMainUse(requestBody)
            res.status(200).json(webResponses.successResponse('New main use of this product!', newProductMainUse));
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 *  API to get detail of a product from database based on its name
 *  endpoint: /profit/porto/upload-product-services
 *  Description:
 *      This API used to post product services of a product since one product can has multiple services
 *  @param product_name
 *  @param product_service_name
 *  @param product_service_description
*/
async function postNewProductServices(req, res, next) {
    try {
         /* Declare input as a request body */
        const requestBody = req.body;
        /* Check for null values on request body - implement checkForNullValues */
        if (checkForNullValues(req)) {
            res.status(400).json(webResponses.errorResponse('Invalid request! Request body cannot contains null value'));
            throw new Error('Null value in request body!');
        } else {
            /* Post product services to database */
            const newProductServices = await productGuideService.addNewProductService(requestBody);
            res.status(200).json(webResponses.successResponse('New main use of this product!', newProductServices));
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    postNewProduct,
    postProductLogo,
    postProductTariffEvidence,
    postProductEvidence,
    postNewMainUse,
    postProductMainUse,
    postNewProductServices
}