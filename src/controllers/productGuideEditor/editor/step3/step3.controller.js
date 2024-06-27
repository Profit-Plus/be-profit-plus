const stepThreeService = require('../../../../services/productGuideEditor/editor/step3/step3.service');
const miscService = require('../../../../services/productGuideEditor/editor/misc/misc.service');
const response = require('../../../../helpers/web/webResponses');

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
        console.log(details)

        /* Get the operating model UUID based on product name query param */
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid;

        /* Update the location */

        const operatingModelDetails = await stepThreeService.getOperatingModelDetails(operatingModelId);

        await stepThreeService.updateOperatingModeLocation(operatingModelId, details.location);

        await Promise.all(operatingModelDetails.product_op_supplier.map(async (supplier) => {
            await stepThreeService.deleteOpSupplier(supplier.product_op_supplier_uuid);
        }));
        /* Add suppliers */
        await Promise.all(details.suppliers.map(async (supplier) => {
            const supplierId = uuidv4();
            await stepThreeService.addOpSupplier(supplierId, operatingModelId, supplier);
        }));

        await Promise.all(operatingModelDetails.product_op_business_process_header.map(async (process) => {
            await Promise.all(process.product_op_business_process_nodes.map(async (node) => {
                await stepThreeService.deleteOpBusinessProcessNode(node.product_op_business_process_nodes_uuid);
            }));
            await stepThreeService.deleteOpBusinessProcessHeader(process.product_op_business_process_header_uuid);
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

        await Promise.all(operatingModelDetails.product_op_information_internal.map(async (information) => {
            await stepThreeService.deleteInternalInformation(information.product_op_information_internal_uuid);
        }));

        /* Add internal informations */

        await Promise.all(details.information.internal.map(async (information) => {
            const internalInformationId = uuidv4();
            await stepThreeService.addInternalInformation(internalInformationId, operatingModelId, information);
        }));

        await Promise.all(operatingModelDetails.product_op_information_external.map(async (information) => {
            await stepThreeService.deleteExternalInformation(information.product_op_information_external_uuid);
        }));

        /* Add external informations */
        await Promise.all(details.information.external.map(async(information) => {
            const externalInformationId = uuidv4();
            await stepThreeService.addExternalInformation(externalInformationId, operatingModelId, information);
        }));

        await Promise.all(operatingModelDetails.product_op_organization_header.product_op_organization_nodes.map(async (organization) => {
            await stepThreeService.deleteOpOrganizationNodes(organization.product_op_organization_nodes_uuid);
        }));

        /* Add organization head */
        const organizationHeadId = uuidv4();
        await stepThreeService.addOpOrganizationHeader(organizationHeadId, operatingModelId, details.organization.head);

        /* Add organization nodes */
        await Promise.all(details.organization.nodes.map(async (node) => {
            const nodeId = uuidv4();
            await stepThreeService.addOpOrganizationNodes(nodeId, organizationHeadId, node.name);
        }));

        await Promise.all(operatingModelDetails.product_op_management_systems.map(async (mgt) => {
            await stepThreeService.deleteManagementSystems(mgt.product_op_management_systems_uuid);
        }));

        /* Add management systems */
        await Promise.all(details.managementSystems.map(async (mgt) => {
            const managementSystemId = uuidv4();
            await stepThreeService.addManagementSystems(managementSystemId, operatingModelId, mgt);
        }));

        res.status(200).json(response.successResponse('Operating model details successfully updated'));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_operating_model')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

async function getOperatingModelDetails(req, res, next) {
    try {
        const productName = String(req.query.product);
        if (!productName) {
            res.status(422).json(response.errorResponse('Product name is required'));
            next();
        }
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid

        const operatingModelDetails = await stepThreeService.getOperatingModelDetails(operatingModelId);
        
        if (operatingModelDetails.product_op_supplier.length === 0) {
            operatingModelDetails.product_op_supplier = [{
                product_supplier_uuid: '',
                product_operating_model_uuid: operatingModelId,
                product_supplier_description: ''
            }]
        }

        res.status(200).json(response.successResponse('Operating model details successfully retrieved', operatingModelDetails));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_operating_model')`)) {
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
    console.log('called')
    try {
        /* Initialize request query param and formidable instance */
        const productName = String(req.query.product);
        const hostName = String(req.query.host).toUpperCase();

        /* Generate the ID and get the operating model UUID based on product name query param */
        if (!productName) {
            res.status(422).json(response.errorResponse('Product name is required'));
            next();
        }
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid;
        
        const gtmHostId = uuidv4();

        const form = new formidable.IncomingForm();

        form.parse(req, async function(error, fields, files) {
            if (error) {
                res.status(422).json(response.errorResponse ('Failed to parse data'));
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
                        
                        /* delete if the file is already exist */
                        
                        if (filestream.existsSync(newPath)) {
                            filestream.unlinkSync(newPath);
                        }

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

                await stepThreeService.addOpGtomHost(operatingModelId, details);

                res.status(200).json(response.successResponse('Operating model GTM Host details successfully updated'));
            }
        });

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_operating_model')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
    }
}

async function getOperatingModelGtmHost(req, res, next) {
    try {
        const productName = String(req.query.product);
        if (!productName) {
            res.status(422).json(response.errorResponse('Product name is required'));
            next();
        }
        const operatingModelId = (await miscService.getProductOperatingModelIdByProductName(productName)).product_operating_model.product_operating_model_uuid

        const gtmHosts = await stepThreeService.getOpGtomHost(operatingModelId);

        res.status(200).json(response.successResponse('Operating model GTM Host details successfully retrieved', gtmHosts));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_operating_model')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

module.exports = {
    updateOperatingModelDetails,
    getOperatingModelDetails,
    addOperatingModelGtmHost,
    getOperatingModelGtmHost
}