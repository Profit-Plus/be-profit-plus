const templateService = require('../../services/template/template.service');
const stepOneService = require('../../services/productGuide/stepOne.service');
const webResponses = require('../../helpers/web/webResponses');

const { Prisma } = require('@prisma/client');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 * @function createNewProduct to create a new template for product (contains only product name without any other data)
 * @endpoint http://localhost:3001/profitplus/porto/create-new-product
 * @param {JSON} req  
 * @param {function} next
 * @return {JSON} res 
 */
async function createNewProduct(req, res, next) {
    try {
        /* Request body */
        const product = req.body;
        
        /* Create new product template */
        await templateService.stepOneTemplate(product);

        res.status(200).json(webResponses.successResponse('Successfully create new product template!', product));
    
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Unavailable name!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }
        
        next(error);
    }
}

/**
 * @function updateProduct to update the template of the product with current data
 * @endpoint http://localhost:3001/profitplus/porto/update-product-details
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function updateProductDetail(req, res, next) {
    try {
        /* Request body */
        const product = req.body;

        /* Perform update product details operation */
        await stepOneService.updateProductDetail(product);
        res.status(200).json(webResponses.successResponse('Product details successfully updated!', product));
        
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Product not found!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addNewProductTaxonomy to add a new name in taxonomy
 * @endpoint http://localhost:3001/profitplus/porto/add-new-taxonomy
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function addNewProductTaxonomy(req, res, next) {
    try {
        /* Request body */
        const taxonomy = req.body;

        /* adding a new name in taxonomy */
        await stepOneService.addNewProductTaxonomy(taxonomy);
        res.status(200).json(webResponses.successResponse('New taxonomy added!', taxonomy));
        
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
 * @function getProductTaxonomy to get all taxonomies from taxonomy list
 * @endpoint http://localhost:3001/profitplus/porto/get-taxonomy
 * @param {JSON} res 
 */
async function getProductTaxonomy(req, res, next) {
    try {
        /* Send response */
        const getTaxonomy = await stepOneService.getProductTaxonomy();
        res.status(200).json(webResponses.successResponse('Get all taxonomies', getTaxonomy));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(409).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addNewProductUnit to add a new name in unit
 * @endpoint http://localhost:3001/profitplus/porto/add-new-unit
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function addNewProductUnit(req, res, next) {
    try {
        /* Request body */
        const unit = req.body;

        /* adding a new name in taxonomy */
        await stepOneService.addNewProductUnit(unit);
        res.status(200).json(webResponses.successResponse('New unit added!', unit));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Unit name has been existed!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(500).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function getProductUnit to get all units from unit list
 * @endpoint http://localhost:3001/profitplus/porto/get-units
 * @param {JSON} res 
 */
async function getProductUnit(req, res, next) {
    try {
        /* Send response */
        const getUnit = await stepOneService.getProductUnit();
        res.status(200).json(webResponses.successResponse('Get all units', getUnit));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientRustPanicError){
            res.status(500).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addProductServices to upload some services of a product
 * @endpoint http://localhost:3001/profitplus/porto/add-new-services
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addProductServices(req, res, next) {
    try {
        /* Request body: productName as a string and services as an array */
        const { productName, services } = req.body;

        /* Add some services of the product */
        await Promise.all(services.map(async (service) => {
            await stepOneService.createProductServices(productName, service);
        }));

        res.status(200).json(webResponses.successResponse('Successfully added new services!', {productName, services}));

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(409).json(webResponses.errorResponse("Invalid input!"));
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            res.status(500).json(webResponses.errorResponse("Internal server error!"));
        }

        next(error);
    }
}

/**
 * @function addProductMainUse to upload some main uses of a product
 * @endpoint http://localhost:3001/profitplus/porto/add-new-mainuse
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function addProductMainUse(req, res, next) {
    try {
        /* Request body */
        const {productName, mainUse } = req.body;

        /* adding some new main uses of the product */
        await Promise.all(mainUse.map(async (name) => {
            await stepOneService.addProductMainUse(productName, name);
        }));
        
        res.status(200).json(webResponses.successResponse('New services added!', mainUse));
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
 * @function uploadProductGallery to upload some picture's of product
 * Can be implemented and modified for any cases that need to upload multiple files
 * 
 * @endpoint http://localhost:3001/profitplus/porto/upload-product-gallery
 * @param {File} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function uploadProductGallery(req, res, next) {
    try {
        /* Make the instance of formidable */
        const form = new formidable.IncomingForm();
        form.multiples = true;

        /* Parse file to server */
        form.parse(req, function(error, fields, files) {
            if (error) {
                res.status(400).json(webResponses.errorResponse('Failed to uploading the file'));
                throw error;
            }

            /* Get the fileName value for the folder */
            const folderName = fields.fileName;
            const uploadDir = path.join('uploads', 'gallery', folderName.toString());

            /* Array to store the directory of all pictures */
            const pictsDir = [];

            /* Check the availibility of the directory. If it's not exist, create a new one */
            filestream.mkdirSync(uploadDir, { recursive: true });

            /* Get the filenames and path for each files and store them to database */
            const fileUploads = Object.values(files.image).map(file => {
                const newFileName = `${uuidv4()}_${Date.now()}` + '.jpg';
                const newFilePath = path.join(uploadDir, newFileName);

                /* Store the directory of each picture to array */
                const fileDir = "profit-plus-api\\src\\" + newFilePath.toString() + newFileName;
                pictsDir.push(fileDir);
                
                return {
                    fileName: newFileName,
                    oldPath: file.filepath,
                    newPath: newFilePath
                }
            });

            /* Move each file to the new path */
            Promise.all(fileUploads.map(file => {
                return new Promise((resolve, reject) => {
                    mv(file.oldPath, file.newPath, function(error) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                })
            }))
            .then(() => {
                res.status(200).json(webResponses.successResponse('Images uploaded successfully'));
            })
            .catch(error => {
                res.status(400).json(webResponses.errorResponse('An error is occured when uploading the files'));
                next(error);
            });

            /* Store all the directory of pictures to database */
            const storePictDirToDb = stepOneService.addProductGallery(folderName.toString().toLocaleLowerCase(), pictsDir);
            storePictDirToDb().catch(error => {
                next(error);
            });
        });
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error'));
        next(error);
    }
}

/**
 * @function uploadProductFile to send a single file uploaded to the corresponding folder
 * @endpoint http://localhost:3001/profitplus/porto/upload-file
 * @param {File} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
async function uploadProductFile(req, res, next) {
    try {
        /* Make the instance of formidable */
        const form = new formidable.IncomingForm();

        /* Parse the file to server */
        form.parse(req, async function (error, fields, files) {
            /* Properties of file */
            const productName = fields.productName.toString().toLocaleLowerCase();
            if (error) {
                return res.status(400).json(webResponses.errorResponse('Failed to upload the file'));
            }

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
                        const uploadFolder =  path.join('uploads', documentType.toString());
                        
                        /* Check if the upload folder is exist */
                        if (!filestream.existsSync(uploadFolder)) {
                            res.status(400).json(webResponses.errorResponse('Invalid document!'));
                            throw new Error('Invalid type of document!');
                        }
                        
                        /* Set the new path for uploaded file */
                        const newPath = path.join('uploads', documentType.toString()) + '\\' + productName + '.' + extension.toString();
                        const completePath = 'profit-plus-api\\src\\' + newPath; 
                        
                        /* Perform file uploading */
                        await filestream.promises.copyFile(oldPath, newPath);
                        const updateDocumentDir = stepOneService.updateProductFileDir(productName, documentType, completePath);
                        updateDocumentDir().catch(error => {
                            throw(error);
                        });

                        /* Return the output */
                        return {
                            productName: productName,
                            documentType: documentType,
                            documentPath: completePath
                        }

                    } else {
                        next(new Error('Invalid type of document! Invalid type of document'));
                    }
                });

                /* Store all files to corresponding directory */
                const uploadPerform = await Promise.all(uploadPromises);
                res.status(200).json(webResponses.successResponse('File uploaded successfully', uploadPerform));

            } catch (error) {
                res.status(400).json(webResponses.errorResponse('Failed to upload the file'));
                next(error);
            }
        });
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error'));
        next(error);
    }
}

/**
 * Export function to modules
 */
module.exports = {
    createNewProduct,
    updateProductDetail,
    addNewProductTaxonomy,
    getProductTaxonomy,
    addNewProductUnit,
    getProductUnit,
    addProductServices,
    addProductMainUse,
    uploadProductGallery,
    uploadProductFile
}