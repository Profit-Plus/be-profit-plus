const stepThreeService = require('../../services/productGuide/stepThree.service');
const webResponses = require('../../helpers/web/webResponses');

const formidable = require('formidable');
const path = require('path');
const mv = require('mv');
const { Prisma } = require('@prisma/client');

/**
 * @function addPartnershipGtmHostDetails add the details 
 * of GTM Host if the category is partnership
 * @endpoint http://localhost:3001/profitplus/porto/add-partnership-gtm-details
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Function} next 
 */
async function addPartnershipGtmHostDetails(req, res, next) {
    try {
        /* Request body */
        const productPartnership = req.body;

        /* Add new partnership details in database */
        const newProductPartnershipDetail = await stepThreeService.addPartnershipGtmHost(productPartnership);
        res.status(200).json(webResponses.successResponse(
            'New partnership details added!', 
            newProductPartnershipDetail
        ));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function uploadPartnershipGtmHostFile add the partnership file to partnership directory
 * @endpoint http://localhost:3001/profitplus/porto/add-partnership-gtm-file
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function uploadPartnershipGtmHostFile(req, res, next) {
    try {
        /* Parse file to server */
        const form = new formidable.IncomingForm();
        form.parse(req, function(error, fields, files) {
            /* Get the product name from field */
            const productName = fields.productName.toString().toLowerCase();
            if (error) {
                res.status(400).json(webResponses.errorResponse('Failed to uploading the file'));
                next(error);
            }

            /* Set the new path for uploaded file */
            const oldPath = files.partnership[0].filepath;
            const fileExtension = files.partnership[0].originalFilename.split('.').pop();
            
            /* Check if the file type is pdf */
            if (fileExtension === 'pdf') {
                const newPath = path.join('uploads', 'partnership') + '\\' + productName + '.' + fileExtension.toString();
                const completePath = 'profit-plus-api\\src\\' + newPath;

                /* Perform uploading file to Server */
                mv(oldPath, newPath, async function(error) {
                    if (error) {
                         next(error);
                    }

                    /* Save the directory of the file to database */
                    const updatePartnershipFileDir = await stepThreeService.updatePartnershipFileDir(productName, completePath);

                    res.status(200).json(webResponses.successResponse(
                        'File updated successfully', 
                        updatePartnershipFileDir
                    ));
                });

            } else {
                res.status(409).json(webResponses.errorResponse('The filetype is invalid! PDF only'));
                next(error);
            }
        });
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Server is unaccessible! Internal error'));
        next(error);
    }
}

/**
 * @function updateProductLocation update the location of the product
 * @endpoint http://localhost:3001/profitplus/porto/update-product-location
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function updateProductLocation(req, res, next) {
    try {
        /* Request body */
        const product = req.body;

        /* Update the location of the product */
        const updateProductLocation = await stepThreeService.updateProductLocation(product);
        res.status(200).json(webResponses.successResponse(
            'Location successfully updated!',
            updateProductLocation
        ));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addIblOblGtmHost add a new details of GTM Host in IBL/OBL category
 * @endpoint  http://localhost:3001/profitplus/porto/add-iblobl-gtm-details
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addIblOblGtmHost(req, res, next) {
    try {
        /* Request body */
        const scenario = req.body;

        /* Add new IBL/OBL details */
        const addScenario = await stepThreeService.updateIblOblGtmHost(scenario);
        res.status(200).json(webResponses.successResponse(
            'New scenario added!',
            addScenario
        ));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addProductSuplier add new suppliers of the product
 * @endpoint http://localhost:3001/profitplus/porto/add-product-suppliers
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addProductSupplier(req, res, next) {
    try {
        /* Request body as an array */
        const { productName, suppliers } = req.body;

        /* add new supplier of the product */
        await Promise.all(suppliers.map(async (supplier) => {
            await stepThreeService.addProductSupplier(productName, supplier);
        }));

        res.status(200).json(webResponses.successResponse('New suppliers added!', {productName, suppliers}));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addBusinessModel add new business model of the product
 * @endpoint http://localhost:3001/profitplus/porto/add-business-process
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addBusinessProcess(req, res, next) {
    try {
        /* Request body as an array */
        const { productName, businessProcess } = req.body;

        /* add new supplier of the product */
        await Promise.all(businessProcess.map(async (process) => {
            await stepThreeService.addProductBusinessProcess(productName, process);
        }));

        res.status(200).json(webResponses.successResponse('New business process added!', {productName, businessProcess}));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addInternalInformation add new internal information
 * @endpoint http://localhost:3001/profitplus/porto/add-internal-information
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addInternalInformation(req, res, next) {
    try {
        /* Request body as an array */
        const { information } = req.body;

        /* add some new internal informations */
        const addInformation = await stepThreeService.addInternalInformation(information);
        res.status(200).json(webResponses.successResponse(
            'New informations added!',
            addInformation
        ));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addExternalInformation add new external information
 * @endpoint http://localhost:3001/profitplus/porto/add-external-information
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addExternalInformation(req, res, next) {
    try {
        /* Request body as an array */
        const { information } = req.body;

        /* add some new internal informations */
        const addInformation = await stepThreeService.addExternalInformation(information);
        res.status(200).json(webResponses.successResponse(
            'New informations added!',
            addInformation
        ));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addProductOrganization add new organization details of the product
 * @endpoint  http://localhost:3001/profitplus/porto/add-product-organization
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addProductOrganization(req, res, next) {
    try {
        /* Request Body */
        const { head, node } = req.body;

        /* add the organization head of the product */
        /* Get the product name from array head */
        var productName = '';
        await Promise.all(head.map(async (org) => {
            const addHead = await stepThreeService.addProductOrganizationHead(org);
            productName = org.product_name;
            return addHead;
        }));

        await Promise.all(node.map(async (org) => {
            const addNode = await stepThreeService.addProductOrganizationNode(productName, org);
            return addNode.org;
        }));

        /* Send a response */
        res.status(200).json(webResponses.successResponse('New organization added!', { head, node }));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json(webResponses.errorResponse('This product has been added!'));
        } else {
            res.status(500).json(webResponses.errorResponse('Internal server error!'));
        }
        
        next(error);
    }
}

async function addProductManagementSystem(req, res, next) {
    try {
        /* Request body: productName as a string and element as an array */
        const { productName, managementSystem } = req.body;

        /* Add some new management system elements of the product */
        await Promise.all(managementSystem.map(async (element) => {
            await stepThreeService.addProductManagementSystem(productName, element);
        }));

        /* Send a response */
        res.status(200).json(webResponses.successResponse('New organization added!', { productName, managementSystem }));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

module.exports = {
    addPartnershipGtmHostDetails,
    uploadPartnershipGtmHostFile,
    addIblOblGtmHost,
    updateProductLocation,
    addProductSupplier,
    addBusinessProcess,
    addInternalInformation,
    addExternalInformation,
    addProductOrganization,
    addProductManagementSystem
}