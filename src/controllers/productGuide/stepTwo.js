const templateService = require('../../services/template/template.service');
const stepTwoService = require('../../services/productGuide/stepTwo.service');
const webResponses = require('../../helpers/web/webResponses');

const { Prisma } = require('@prisma/client');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 * @function createStpdbProduct to create a new template for stpdb of the product (contains only product name without any other data)
 * @endpoint http://localhost:3001/profitplus/porto/create-new-product-stpdb
 * @param {JSON} req  
 * @param {function} next
 * @return {JSON} res 
 */
async function createStpdbProduct(req, res, next) {
    try {
        /* Initalize the request body */
        const product = req.body;

        /* General template of segmenting targeting */
        await templateService.stepTwoTemplate(product);

        /* add values from Penta helix array to database with productName as its foreign key */
        const pentaHelix = ['business', 'academy', 'public', 'government', 'community'];
        await Promise.all(pentaHelix.map(async (helix) => {
            await templateService.pentaHelixTemplate(product, helix);
        }));

        res.status(200).json(webResponses.successResponse('Successfully create new product template!', product));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Product name cannot be duplicated!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function createSegmentingTargeting to add some new values for segmenting and targeting map of the product
 * @endpoint http://localhost:3001/profitplus/porto/add-segmenting-targeting
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Function} next 
 */
async function createSegmentingTargeting(req, res, next) {
    try {
        /* Initialize the request body */
        const { productName, pentaHelix, benefits, legends } = req.body;

        /* Add some segmenting targeting penta helix of the product */
        await Promise.all(pentaHelix.map(async (helix) => { 
            await stepTwoService.updatePentahelixDetails(productName, helix);
        }));
        
        /* Add benefits from the segmenting and targeting of the product */
        await Promise.all(benefits.map(async (benefit) => { 
            await stepTwoService.addSegmentingTargetingBenefits(productName, benefit); 
        }));
        
        /* Add details of the legends in segmenting-targeting map */
        await Promise.all(legends.map(async (legend) => { 
            await stepTwoService.addSegmentingTargetingLegends(productName, legend);
        }));

        res.status(200).json(webResponses.successResponse('Data successfully updated!', {
            productName, pentaHelix, benefits, legends
        }));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function updateProductMarketPotential to add some new values of market potential to the product
 * @endpoint http://localhost:3001/profitplus/porto/add-market-potential
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Function} next 
 */
async function updateProductMarketPotential(req, res, next) {
    try {
        /* Initialize the request body */
        const { productName, marketPotential} = req.body;

        /* add some values of market potential to the product */
        await Promise.all(marketPotential.map(async (market) => {
            await stepTwoService.updateProductMarketPotential(productName, market);
        }));

        res.status(200).json(webResponses.successResponse('Data successfully inserted!', {
            productName, marketPotential
        }));

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
 * @function updateProductPositioningIndicator to add indicators of product positioning
 * @endpoint http://localhost:3001/profitplus/porto/update-product-positioning-indicators
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Function} next 
 */
async function updateProductPositioningIndicator(req, res, next) {
    try {
        /* Initialize the request body */
        const { productName, positioningIndicators } = req.body;

        /* add some values of market potential to the product */
        await Promise.all(positioningIndicators.map(async (indicator) => {
            await stepTwoService.updateProductPositioningIndicator(productName, indicator);
        }));

        res.status(200).json(webResponses.successResponse('Data successfully inserted!', {
            productName, positioningIndicators
        }));
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
 *  @function uploadProductPositioningPictureDetails to add picture to positioning map and save the details to database
 *  @endpoint http://localhost:3001/profitplus/porto/add-positioning-picture
 *  @param {*} req 
 *  @param {*} res 
 *  @param {*} next 
 */
async function uploadProductPositioningPictureDetails(req, res, next) {
    try {
        /* Initialize the instance of formidable to perform file uploading */
        const form = new formidable.IncomingForm();

        form.parse(req, async function (error, fields, files) {
            /* Uploaded file properties */
            const productName = fields.productName.toString();
            const uploadedFileName = fields.pictureName.toString();
            const pictureDescription = fields.pictureDescription.toString();
            const xPosition = parseInt(fields.xPosition, 10);
            const yPosition = parseInt(fields.yPosition, 10);

            /* Check availibility of the picture's name in a product */
            const availibility = await stepTwoService.checkPositioningPictureAvailibility(productName, uploadedFileName);
            if (availibility) {
                res.status(409).json(webResponses.errorResponse('Picture\'s name has been existed!'));
                next(error);
            } else {
                /* Get the old path and check the extension of the picture */
                const oldPath = files.picture[0].filepath;
                const fileExtension = files.picture[0].originalFilename.split('.').pop();
                const allowedExtension = ['jpg', 'jpeg', 'png'];

                if (allowedExtension.includes(fileExtension)) {
                    /* Set the name of the product as the name of the directory for all pictures (create if not exist) */
                    const targetDir = path.join('uploads', 'positioning', productName.toString().toLocaleLowerCase());
                    filestream.mkdirSync(targetDir, { recursive: true });

                    /* Create a complete directory for the uploaded file */
                    const newPictureFileName = `${uuidv4()}_${Date.now()}` + '.' + fileExtension.toString();
                    const uploadDir = targetDir + '\\' + newPictureFileName;
                    const compDir = 'profit-plus-api\\src\\' + uploadDir;

                    /* Perform file upload to the server */
                    mv(oldPath, uploadDir, async function (error) {
                        if (error) {
                            res.status(409).json(webResponses.errorResponse('Uploading failed!'));
                            next(error);
                        }

                        /* Store all details to an object and Save them to database */
                        const pictureDetails = {
                            productName: productName,
                            pictureName: uploadedFileName,
                            pictureDir: compDir,
                            pictureDescription: pictureDescription,
                            xPosition: xPosition,
                            yPosition: yPosition
                        };

                        const uploadPicturePositioning = await stepTwoService.addProductPositioningPictures(pictureDetails);

                        /* Send response */
                        res.status(200).json(webResponses.successResponse('File updated successfully', uploadPicturePositioning));
                    });

                } else {
                    res.status(409).json(webResponses.errorResponse('The filetype is invalid! Image file only'));
                    next(error);
                }
            }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code === 'P2003') {
                res.status(409).json(webResponses.errorResponse("Invalid input!"));
            }
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(500).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function updateProductPositioningUserStory to store the user story of product positioning
 * @endpoint http://localhost:3001/profitplus/porto/add-positioning-user-story
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Function} next 
 */
async function updateProductPositioningUserStory(req, res, next) {
    try {
        /* Initialize request body */
        const { productName, userStory } = req.body;

        /* add some values of market potential to the product */
        await Promise.all(userStory.map(async (story) => {
            await stepTwoService.updateProductPositioningUserStory(productName, story);
        }));

        res.status(200).json(webResponses.successResponse('Data successfully inserted!', { productName, marketPotential}));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(500).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
} 

module.exports = {
    createStpdbProduct,
    createSegmentingTargeting,
    updateProductMarketPotential,
    updateProductPositioningIndicator,
    uploadProductPositioningPictureDetails,
    updateProductPositioningUserStory
}