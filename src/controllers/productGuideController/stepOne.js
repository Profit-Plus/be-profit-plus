const stepOneService = require('../../services/productGuide/stepOne.service');
const webResponses = require('../../helpers/web/webResponses');

const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 * @function createNewProduct to create a new template for product (contains only product name without any other data)
 * @endpoint http://localhost:3001/profitplus/porto/create-new-product
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function createNewProduct(req, res, next) {
    try {
        /* Request body */
        const product = req.body;
        
        /* Check the availibity */
        const checkAvailibilty = await stepOneService.productAvailability(product);
        if (checkAvailibilty) {
            res.status(400).json(webResponses.errorResponse('Unavailable name! please input another name'));
            throw new Error('Unavailable name!');
        } else {
            /* Create new product template */
            const createTemplate = await stepOneService.createProductTemplate(product);
            res.status(200).json(webResponses.successResponse('Successfully create new product template!', createTemplate));
        }
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Server is unaccessible! Internal error'));
        throw error;
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
        const updateProductDetails = await stepOneService.updateProductDetail(product);
        res.status(200).json(webResponses.successResponse('Product details successfully updated!', updateProductDetails));
        
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error!'));
        throw error;
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
        const addTaxonomy = await stepOneService.addNewProductTaxonomy(taxonomy);
        res.status(200).json(webResponses.successResponse('New taxonomy added!', addTaxonomy));
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error!'));
        throw error;
    }
}

/**
 * @function addNewProductTaxonomy to add a new name in taxonomy
 * @endpoint http://localhost:3001/profitplus/porto/get-taxonomy
 * @param {JSON} res 
 */
async function getProductTaxonomy(req, res, next) {
    try {
        /* Send response */
        const getTaxonomy = await stepOneService.getProductTaxonomy();
        res.status(200).json(webResponses.successResponse('Get all taxonomy', getTaxonomy));
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error!'));
        throw error;
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
        const addUnit = await stepOneService.addNewProductUnit(unit);
        res.status(200).json(webResponses.successResponse('New taxonomy added!', addUnit));
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error!'));
        throw error;
    }
}

/**
 * @function addNewProductTaxonomy to add a new name in taxonomy
 * @endpoint http://localhost:3001/profitplus/porto/get-units
 * @param {JSON} res 
 */
async function getProductUnit(req, res, next) {
    try {
        /* Send response */
        const getUnit = await stepOneService.getProductUnit();
        res.status(200).json(webResponses.successResponse('Get all taxonomy', getUnit));
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error!'));
        throw error;
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
                throw error;
            });

            /* Store all the directory of pictures to database */
            const storePictDirToDb = stepOneService.addProductGallery(folderName.toString().toLocaleLowerCase(), pictsDir);
            storePictDirToDb().catch(error => {
                throw error;
            });
        });
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error'));
        throw error;
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
                    var documentExtension = '';
                    var oldPath = '';

                    /* Set the extension and old path of the document based on the documentType */
                    switch (documentType.toString()) {
                        case 'logo':
                            documentExtension = '.jpg'
                            oldPath = files.logo[0].filepath;
                            break;
                        case 'playbook':
                            documentExtension = '.pdf';
                            oldPath = files.playbook[0].filepath;
                            break;
                        case 'marketcoll':
                            documentExtension = '.pdf';
                            oldPath = files.marketcoll[0].filepath;
                            break;
                        default:
                            throw error;
                    }

                    /* Set the folder for uploaded file */
                    const uploadFolder =  path.join('uploads', documentType.toString());
                    
                    /* Check if the upload folder is exist */
                    if (!filestream.existsSync(uploadFolder)) {
                        res.status(400).json(webResponses.errorResponse('Invalid document!'));
                        throw new Error('Invalid type of document!');
                    }
                    
                    /* Set the new path for uploaded file */
                    const newPath = path.join('uploads', documentType.toString()) + '\\' + productName + documentExtension.toString();
                    const completePath = 'profit-plus-api\\src\\' + newPath; 
                    
                    /* Perform file uploading */
                    await filestream.promises.copyFile(oldPath, newPath);
                    const updateDocumentDir = stepOneService.updateProductFileDir(productName, documentType, completePath);
                    updateDocumentDir().catch(error => {
                        throw(error);
                    });

                    return {
                        productName: productName,
                        documentType: documentType,
                        documentPath: completePath
                    }
                });

                /* Store all files to corresponding directory */
                const uploadPerform = await Promise.all(uploadPromises);
                res.status(200).json(webResponses.successResponse('File uploaded successfully', uploadPerform));

            } catch (error) {
                res.status(400).json(webResponses.errorResponse('Failed to upload the file'));
                throw error;
            }
        });
    } catch (error) {
        res.status(500).json(webResponses.errorResponse('Internal server error'));
        throw error;
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
    uploadProductGallery,
    uploadProductFile
}