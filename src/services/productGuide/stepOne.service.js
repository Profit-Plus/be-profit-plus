const { database } = require('../../helpers/utils/db/database');

/**
 * Update some details of the requested product
 * @param {Request} product 
 * @returns async function to perform operation
 */
function updateProductDetail(product) {
    return database.$transaction([
        database.product.update({
            where: {
                product_name: product.productName
            },
            data: {
                product_description: product.productDescription,
                product_profile_link: product.productProfileLink,
                product_website_label: product.productWebsiteLabel,
                taxonomy: {
                    connect: {
                        taxonomy_name: product.productTaxonomy
                    }
                }
            }
        }),
        database.unit_in_charge.update({
            where: {
                product_name: product.productName
            },
            data: {
                unit: {
                    connect: {
                        units_name: product.unitName
                    }
                }
            }
        })
    ]);
}

/**
 * Add a new unit name
 * @param {Request} unit 
 * @returns async function to perform operation 
 */
function addNewProductUnit(unit) {
    return database.units.create({
        data: {
            units_name: unit.unitName
        }
    });
}

function getProductUnit() {
    return database.units.findMany({
        where: {
            NOT: {
                units_name: 'UNDEFINED'
            }
        },
        select: {
            units_name: true
        }
    });
}

/**
 * Add a new product taxonomy name
 * @param {Request} taxonomy 
 * @returns async function to perform operation
 */
function addNewProductTaxonomy(taxonomy) {
    return database.taxonomy.create({
        data: {
            taxonomy_name: taxonomy.taxonomyName
        }
    });
}

/**
 * 
 * @returns 
 */
function getProductTaxonomy() {
    return database.taxonomy.findMany({
        where: {
            NOT: {
                taxonomy_name: 'UNDEFINED'
            }
        },
        select: {
            taxonomy_name: true
        }
    });
}

/**
 * Create new product service
 * @param {JSON} product 
 * @param {Object} services 
 * @returns async function to perform operation
 */
function createProductServices(productName, services) {
    return database.product_service.createMany({
        data: {
            product_name: productName,
            product_service_name: services.serviceName,
            product_service_description: services.description
        }
    });
}

/**
 * Create new product service
 * @param {JSON} product 
 * @param {Object} services 
 * @returns async function to perform operation
 */
function addProductMainUse(productName, mainUse) {
    return database.product_main_use.createMany({
        data: {
            product_name: productName,
            main_use_name: mainUse.mainUseName 
        }
    });
}

/**
 * Store the directory of picture in a product gallery
 * @param {String} productName 
 * @param {Array} dirArray 
 * @returns async function to perform operation
 */
function addProductGallery(productName, dirArray) {
    return async function storeDirectory() {
        try {
            for (const data of dirArray) {
                await database.product_gallery.create({
                    data: {
                        product_name: productName,
                        product_gallery_dir: data
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    };
}

/**
 * update the product_file entity based on what type is the file 
 * @param {String} productName 
 * @param {String} documentType 
 * @param {String} productDocumentDir 
 * @returns async function to perform operation
 */
function updateProductFileDir(productName, documentType, productDocumentDir) {
    return async function updateDirectory() {
        try {
            switch(documentType) {
                case 'logo':
                    await database.product_files.update({
                        where: {
                            product_name: productName
                        },
                        data: {
                            product_logo: productDocumentDir
                        }
                    });
                    break;

                case 'playbook':
                    await database.product_files.update({
                        where: {
                            product_name: productName
                        },
                        data: {
                            product_playbook: productDocumentDir
                        }
                    });
                    break;

                case 'marketcoll':
                    await database.product_files.update({
                        where: {
                            product_name: productName
                        },
                        data: {
                            product_marketing_collateral: productDocumentDir
                        }
                    });
                    break;
            }
        } catch (error) {
            throw error;
        }
    };
}

/**
 *  Exporting all functions to module
 */
module.exports = {
    updateProductDetail,
    addNewProductUnit,
    getProductUnit,
    addNewProductTaxonomy,
    getProductTaxonomy,
    createProductServices,
    addProductMainUse,
    addProductGallery,
    updateProductFileDir
}