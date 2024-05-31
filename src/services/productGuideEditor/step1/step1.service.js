const { database } = require('../../../helpers/configuration/db');

/**
 *  @function updateProductOverview to update the data of the first part of product overview 
 */
function updateProductOverview(product, properties) {
    return database.product_overview.update({
        where: {
            product_name: product
        }, 
        data: {
            product_uuid: properties.uuid,
            unit_id: properties.unitId,
            product_description: properties.description,
            taxonomy_uuid: properties.taxonomyId,
            product_profile_link: properties.profileLink,
            product_website_link: properties.websiteLink,
        }
    });
}

/**
 *  @function updateFileDirProductOverview to update the data of the second part of product overview (files directory)
 */
function updateFileDirProductOverview(product, documentType, dir) {
    return async function updateDir() {
        try {
            switch(documentType) {
                case 'logo':
                    await database.product_overview.update({
                        where: {
                            product_name: product
                        },
                        data: {
                            product_logo_dir: dir
                        }
                    });
                    break;

                case 'playbook':
                    await database.product_overview.update({
                        where: {
                            product_name: product
                        },
                        data: {
                            product_playbook_dir: dir
                        }
                    });
                    break;
                
                case 'marketcoll':
                    await database.product_overview.update({
                        where: {
                            product_name: product
                        },
                        data: {
                            product_marketing_collateral_dir: dir
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
 *  @function getProductNameById to get a product ID based on its name
 */
function getProductIdByName(name) {
    return database.product_overview.findUnique({
        where: {
            product_name: name
        },
        select: {
            product_uuid: true
        }
    })
}

/**
 *  @function addProductMainUse to add some main uses of a product
 */
function addProductMainUse(id, productId, properties) {
    return database.product_main_use.createMany({
        data: {
            product_main_use_uuid: id,
            product_uuid: productId,
            product_main_use_name: properties.name,
        }
    });
}

/**
 *  @function addProductService to add some services of a product
 */
function addProductService(id, productId, properties) {
    return database.product_service.createMany({
        data: {
            product_service_uuid: id,
            product_uuid: productId,
            product_service_name: properties.name,
            product_service_desc: properties.description
        }
    });
}

/**
 *  @function addProductGallery to add some galleries of a product
 */
function addProductGallery(id, productId, dir) {
    return database.product_gallery.create({
        data: {
            product_overview_gallery_uuid: id,
            product_uuid: productId,
            product_picture_dir: dir
        }
    });
}

module.exports = {
    updateProductOverview,
    updateFileDirProductOverview,
    getProductIdByName,
    addProductMainUse,
    addProductService,
    addProductGallery
}