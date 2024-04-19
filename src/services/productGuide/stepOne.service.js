const { database } = require('../../helpers/utils/db/database');

/**
 * Create a template for product without any data
 * @param {Request} product 
 * @returns async function to perform operation
 */
function createProductTemplate(product) {
    return database.$transaction([
        database.product.create({
            data: {
                product_name: product.product_name
            }
        }),
        database.unit_in_charge.create({
            data: {
                product_name: product.product_name
            }
        }),
        database.product_files.create({
            data: {
                product_name: product.product_name
            }
        })
    ]);
}

/**
 * Update some details of the requested product
 * @param {Request} product 
 * @returns async function to perform operation
 */
function updateProductDetail(product) {
    return database.$transaction([
        database.product.update({
            where: {
                product_name: product.product_name
            },
            data: {
                product_description: product.product_description,
                product_profile_link: product.profile_link,
                product_website_label: product.website_link,
                taxonomy: {
                    connect: {
                        taxonomy_name: product.taxonomy_name
                    }
                }
            }
        }),
        database.unit_in_charge.update({
            where: {
                product_name: product.product_name
            },
            data: {
                unit: {
                    connect: {
                        units_name: product.unit_name
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
            units_name: unit.unit_name
        }
    });
}

function getProductUnit() {
    return database.units.findMany();
}

/**
 * Add a new product taxonomy name
 * @param {Request} taxonomy 
 * @returns async function to perform operation
 */
function addNewProductTaxonomy(taxonomy) {
    return database.taxonomy.create({
        data: {
            taxonomy_name: taxonomy.taxonomy_name
        }
    });
}

function getProductTaxonomy() {
    return database.taxonomy.findMany();
}

/**
 * Get the product with the certain product_name to check the availibity 
 * @param {Request} product 
 * @returns row with the certain product_name
 */
function productAvailability(product) {
    return database.product.findUnique({
        where: {
            product_name: product.product_name
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
    }
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
    }
}

/**
 *  Exporting all functions to module
 */
module.exports = {
    createProductTemplate,
    updateProductDetail,
    addNewProductUnit,
    getProductUnit,
    addNewProductTaxonomy,
    getProductTaxonomy,
    productAvailability,
    addProductGallery,
    updateProductFileDir
}