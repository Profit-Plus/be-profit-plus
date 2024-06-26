const stepFourService = require('../../../../services/productGuideEditor/editor/step4/step4.service');
const miscService = require('../../../../services/productGuideEditor/editor/misc/misc.service');
const response = require('../../../../helpers/web/webResponses');

const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 *  @function addProductUseCase to add a new use case of the product
 */
async function addProductUseCase(req, res, next) {
    try {
        /* Generate UUID and Initialize instance of formidable */
        const form = new formidable.IncomingForm();

        form.parse(req, async function(error, fields, files) {
            if (error) {
                res.status(422).json(response.errorResponse('File parsing system failed'));
                next(error);

            } else {
                /* Generate UUID, Initialize fields and request param */
                const productName = String(req.query.product);
                const companyName = String(fields.companyName).toLowerCase();
                const companyDesc = String(fields.companyDesc).toLowerCase();
                const productForCompanyDesc = String(fields.productForCompanyDesc).toLowerCase();
                const useCaseDesc = String(fields.useCaseDesc).toLowerCase();
                const useCaseFeatures = String(fields.useCaseFeatures).toLowerCase();

                const productId = (await miscService.getProductIdByName(productName)).product_uuid;
                const useCaseId = uuidv4();

                /* Get the properties of the uploaded logo */
                const oldPath = files.companyLogo[0].filepath;
                const fileExtension = files.companyLogo[0].originalFilename.split('.').pop();

                /* Allowed extension to be uploaded */
                const allowedExtension = ['jpg', 'jpeg', 'png', 'pjpeg', 'pjp', 'pdf'];

                var fileDirectory = '';
                if (allowedExtension.includes(fileExtension)) {
                    /* Set the folder name for the uploaded file */
                    const directory = path.join('resources', 'uploads', 'usecase', productName);

                    /* Make a new directory if doesn't exist before */
                    filestream.mkdirSync(directory, { recursive: true });

                    /* Set the new path for uploaded file */
                    const newPath = directory + '\\' + `${useCaseId}_${companyName}` + '.' + fileExtension.toString();
                    fileDirectory = 'profit-plus-api\\src\\resources\\' + newPath;
                    
                    /* Perform file uploading and store the directory to temporary variables */
                    mv(oldPath, newPath, async function (error) {
                        if (error) {
                            res.status(409).json(response.errorResponse(`Uploading failed for id ${useCaseId}`));
                            next(error);
                        }
                    });

                } else {
                    res.status(415).json(response.errorResponse('Unsupported media type'));
                    next(error);
                }

                /* Encapsulate the details of the use case in an object */
                const useCase = {
                    companyName: companyName,
                    companyDesc: companyDesc,
                    companyLogoDir: fileDirectory,
                    productForCompanyDesc: productForCompanyDesc,
                    useCaseDesc: useCaseDesc,
                    features: useCaseFeatures
                };

                /* Store everything to database */
                await stepFourService.addNewUseCase(useCaseId, productId, useCase);

                res.status(200).json(response.successResponse('New use case added'));
            }
        });

    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error'));
        next(error)
    }
}

async function getProductUseCase(req, res, next) {
    try {
        const productName = String(req.query.product);
        const productId = (await miscService.getProductIdByName(productName)).product_uuid;

        const useCases = await stepFourService.getUseCasesByProductId(productId);

        res.status(200).json(response.successResponse('Use cases fetched', useCases));
    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error'));
        next(error);
    }
}

module.exports = {
    addProductUseCase,
    getProductUseCase
};