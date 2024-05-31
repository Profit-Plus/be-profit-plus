const stepOneService = require('../../../services/productGuideEditor/step1/step1.service');
const response = require('../../../helpers/web/webResponses');

const { Prisma } = require("@prisma/client");
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 * @function updateProductOverview to update the overview details of the product
 */
async function updateProductOverviewDetail(req, res, next) {
    try {
        /* Initialize the instance of formidable */
        const form = new formidable.IncomingForm();

        /* Parse the file to server */
        form.parse(req, async function (error, fields, files) {
            if (error) {
                res.status(422).json(response.errorResponse('File parsing system failed'));
                next();

            } else {
                /* initialize fields and request params */
                const productName = req.query.product;
                const productUnitInCharge = String(fields.unitInCharge);
                const productDescription = String(fields.description);
                const productTaxonomy = String(fields.taxonomy);
                const productProfile = String(fields.profileLink);
                const productWeb = String(fields.webLink);

                /* Generate UUID for product ID */
                const productId = uuidv4();

                /* Get unit ID and taxonomy ID based on the their names */
                const unitInCharge = await stepOneService.getUnitIDByName(productUnitInCharge);
                const taxonomy = await stepOneService.getTaxonomyIdByName(productTaxonomy);

                /* Store the properties to database */
                const properties = {
                    uuid: productId,
                    unitId: unitInCharge.unit_id,
                    description: productDescription,
                    taxonomyId: taxonomy.taxonomy_uuid,
                    profileLink: productProfile,
                    websiteLink: productWeb,
                }

                /* Update product overview except the files directory */
                await stepOneService.updateProductOverview(productName, properties);

                try {
                    /* Iterate each files and perform file upload */
                    const uploadPromises = Object.keys(files).map(async (documentType) => {
                        /* Properties to transferring the file */
                        var docFile;
                        var allowedExtension;

                        /* Set the extension and old path of the document based on the documentType */
                        switch (documentType.toString()) {
                            case 'logo':
                                docFile = files.logo[0];
                                allowedExtension = ['jpg', 'jpeg', 'png'];
                                break;

                            case 'playbook':
                                docFile = files.playbook[0];
                                allowedExtension = ['pdf']
                                break;

                            case 'marketcoll':
                                docFile = files.marketcoll[0];
                                allowedExtension = ['pdf']
                                break;
                                
                            default:
                                throw error;
                        }

                        /* Get the properties of uploaded file */
                        var oldPath = docFile.filepath;
                        var extension = docFile.originalFilename.split('.').pop();

                        /* Check if the uploaded file has appropriate extension */              
                        if (allowedExtension.includes(extension)) {
                            /* Set the folder for uploaded file */
                            const uploadFolder =  path.join('src', 'resources', 'uploads', documentType.toString());

                            /* Make a new directory if doesn't exist before */
                            filestream.mkdirSync(uploadFolder, { recursive: true });

                            /* Set the new path for uploaded file */
                            const newPath = uploadFolder + '\\' + productName + '.' + extension.toString();
                            const completePath = 'profit-plus-api\\src\\resources\\' + newPath; 
                            
                            /* Perform file uploading and store the directory to temporary variables */
                            await filestream.promises.copyFile(oldPath, newPath);
                            const updateDocumentDir = stepOneService.updateFileDirProductOverview(productName, documentType, completePath);
                            updateDocumentDir().catch(error => {
                                throw(error);
                            });
                            
                        } else {
                            res.status(415).json(response.errorResponse('Unsupported media type'));
                            next();
                        }
                    });

                    /* Store all files to corresponding directory */
                    await Promise.all(uploadPromises);
                    
                } catch (error) {
                    res.status(400).json(response.errorResponse('Bad request'));
                    next();
                } 

                res.status(200).json(response.successResponse('Product successfully updated!'));
            }
        });
        
    } catch (error) {
        if (error.code === 'P2003') {
            res.status(400).json(response.errorResponse('Bad request'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error!'));
        }
        
        next(error);
    }
}

/**
 *  @function uploadMainUse to add main uses of a product  
 */
async function addMainUse(req, res, next) {
    try {
        /* Initialize request body and request param */
        const { mainUses } = req.body;
        const productName = req.query.product;

        /* Get product ID by its name */
        const productId = await stepOneService.getProductIdByName(productName);

        /* Add main uses of product to database */
        await Promise.all(mainUses.map(async (item) => {
            /* Generate uuid */
            const id = uuidv4();

            await stepOneService.addProductMainUse(id, productId.product_uuid, item);
        }))

        res.status(200).json(response.successResponse('New services added!'));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                res.status(500).json(response.errorResponse('Incorrect product name'));
            }

        } else {
            res.status(500).json(response.errorResponse('Internal server error'));
        }
        
        next(error);
    }
}

/**
 *  @function addMainUse to add a new main uses of a product
 */
async function addServices(req, res, next) {
    try {
        /* Initialize request body and request params */
        const { services } = req.body;
        const productName = req.query.product;

        /* Get product ID by its name */
        const productId = await stepOneService.getProductIdByName(productName);
        
        /* Add services of a product to database */
        await Promise.all(services.map(async (item) => {
            /* Generate uuid */
            const id = uuidv4();

            await stepOneService.addProductService(id, productId.product_uuid.toString(), item);
        }));

        res.status(200).json(response.successResponse('New services added!'));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                res.status(500).json(response.errorResponse('Incorrect product name'));
            }

        } else {
            res.status(500).json(response.errorResponse('Internal server error'));
        }
        
        next(error);
    }
}

/**
 *  @function addGallery to add gallery of pictures of product 
 */
async function addGallery(req, res, next) {
    try {
        /* Initialize the instance of formidable and make allow multiple uploading */
        const form = new formidable.IncomingForm();
        form.multiples = true;

        form.parse(req, async function (error, fields, files) {
            if (error) {
                res.status(400).json(response.errorResponse('Failed to uploading the file'));
                next(error);
            }

            /* Initilize request param and directory */
            const productName = req.query.product;
            const dir = path.join('src', 'resources', 'uploads', 'gallery', productName);

            /* Get the id of product based on its name */
            const productId = await stepOneService.getProductIdByName(productName);

            /* Check the availibility of the directory and create a new one if doesn't */
            filestream.mkdirSync(dir, { recursive: true });

            /* Set the properties and get the directory of each pictures */
            const pictures = Object.values(files.image).map(file => {
                const newName = `${uuidv4()}_${Date.now()}.jpg`;
                const newDir = path.join(dir, newName);

                /* Concat newName and newDir, and store it to the array */
                const pictureDir = `profit-plus-api\\${newDir.toString()}\\${newName}`;
                
                return {
                    fileName: newName,
                    oldPath: file.filepath,
                    newPath: newDir,
                    dir: pictureDir
                }
            });

            /* Store the pictures to the corresponding directory */
            Promise.all(pictures.map(picture => {
                return new Promise((resolve, reject) => {
                    mv(picture.oldPath, picture.newPath, async function (error) {
                        if (error) {
                            reject(error);
                        } else {
                            const id = uuidv4();
                            await stepOneService.addProductGallery(id, productId.product_uuid, picture.dir);
                            resolve();
                        }
                    });
                });
            }))
            .then(() => {
                res.status(200).json(response.successResponse('Images uploaded successfully'));
            })
            .catch(error => {
                res.status(400).json(response.errorResponse('An error is occured when uploading the files'));
                next(error);
            });
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                res.status(500).json(response.errorResponse('Incorrect product name'));
            }

        } else {
            res.status(500).json(response.errorResponse('Internal server error'));
        }
        
        next(error);
    }
}

module.exports = {
    updateProductOverviewDetail,
    addServices,
    addMainUse,
    addGallery
}