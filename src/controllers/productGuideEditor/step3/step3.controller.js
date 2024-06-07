const stepThreeService = require('../../../services/productGuideEditor/step3/step3.service');
const miscService = require('../../../services/productGuideEditor/misc/misc.service');
const response = require('../../../helpers/web/webResponses');

const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 *  @function updateOperatingModelDetails to update the details of the product's operating model
 */
async function updateOperatingModelDetails(req, res, next) {
    try {
        /* Initialize request body and body param */
        const productName = String(req.query.product);
        const details = req.body;

        /* Get the operating model UUID based on product name query param */
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid;

        /* Update the location */
        await stepThreeService.updateOperatingModeLocation(operatingModelId, details.location);

        /* Add suppliers */
        await Promise.all(details.suppliers.map(async (supplier) => {
            const supplierId = uuidv4();
            await stepThreeService.addOpSupplier(supplierId, operatingModelId, supplier);
        }));

        /* Add business process for each heads and nodes */
        await Promise.all(details.businessProcess.map(async (process) => {
            /* Initialize head UUID for each process and store it to database */
            const headId = uuidv4();
            await stepThreeService.addOpBusinessProcessHeader(headId, operatingModelId, process.head);

            /* Store the nodes for each head */
            await Promise.all(process.nodes.map(async (node) => {
                const nodeId = uuidv4();
                await stepThreeService.addOpBusinessProcessNode(nodeId, headId, node.description);
            }));
        }));

        /* Add internal informations */
        await Promise.all(details.information.internal.map(async (information) => {
            const internalInformationId = uuidv4();
            await stepThreeService.addInternalInformation(internalInformationId, operatingModelId, information);
        }));

        /* Add external informations */
        await Promise.all(details.information.external.map(async(information) => {
            const externalInformationId = uuidv4();
            await stepThreeService.addExternalInformation(externalInformationId, operatingModelId, information);
        }));

        /* Add organization head */
        const organizationHeadId = uuidv4();
        await stepThreeService.addOpOrganizationHeader(organizationHeadId, operatingModelId, details.organization.head);

        /* Add organization nodes */
        await Promise.all(details.organization.nodes.map(async (node) => {
            const nodeId = uuidv4();
            await stepThreeService.addOpOrganizationNodes(nodeId, organizationHeadId, node.name);
        }));

        /* Add management systems */
        await Promise.all(details.managementSystems.map(async (mgt) => {
            const managementSystemId = uuidv4();
            await stepThreeService.addManagementSystems(managementSystemId, operatingModelId, mgt);
        }));

        res.status(200).json(response.successResponse('Operating model details successfully updated'));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_segmenting_targeting')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

/**
 *  @function addOperatingModelGtmHost to add the details of GTM Host in a product's operating model 
 */
async function addOperatingModelGtmHost(req, res, next) {
    try {
        /* Initialize request query param and formidable instance */
        const productName = String(req.query.product);
        const hostName = String(req.query.host).toUpperCase();

        /* Generate the ID and get the operating model UUID based on product name query param */
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid;
        const gtmHostId = uuidv4();

        const form = new formidable.IncomingForm();

        form.parse(req, async function(error, fields, files) {
            if (error) {
                res.status(422).json(response.errorResponse('Failed to parse data'));
                next();

            } else {
                /* Initialize field */
                const description = String(fields.description).toLowerCase();
                var fileDirectory = 'undefined';

                /* Determine the host to perform another operation */
                /* Perform file uploading if the host name is partnership */
                if (hostName === 'PARTNERSHIP') {
                    /* Get the properties of the uploaded file */
                    const oldPath = files.file[0].filepath;
                    const fileExtension = files.file[0].originalFilename.split('.').pop();

                    /* Check the extension of the uploaded file */
                    const allowedExtension = ['jpg', 'jpeg', 'png', 'pjpeg', 'pjp', 'pdf'];
                    if (allowedExtension.includes(fileExtension)) {
                        /* Set the folder name for the uploaded file */
                        const directory = path.join('resources', 'uploads', 'partnership');

                        /* Make a new directory if doesn't exist before */
                        filestream.mkdirSync(directory, { recursive: true });

                        /* Set the new path for uploaded file */
                        const newPath = directory + '\\' + productName + '.' + fileExtension.toString();
                        fileDirectory = 'profit-plus-api\\src\\resources\\' + newPath; 
                        
                        /* Perform file uploading and store the directory to temporary variables */
                        mv(oldPath, newPath, async function (error) {
                            if (error) {
                                res.status(409).json(response.errorResponse(`Uploading failed for id ${gtmHostId}`));
                                next(error);
                            }
                        });
                        
                    } else {
                        res.status(415).json(response.errorResponse('Unsupported media type'));
                        next();
                    }          
                }
                
                /* Store the details */
                const details = {
                    host: hostName,
                    description: description,
                    fileDir: fileDirectory
                }

                await stepThreeService.addOpGtomHost(gtmHostId, operatingModelId, details);

                res.status(200).json(response.successResponse('Operating model GTM Host details successfully updated'));
            }
        });

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_positioning')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
    }
}

module.exports = {
    updateOperatingModelDetails,
    addOperatingModelGtmHost
}