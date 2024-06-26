const { database } = require('../../../helpers/configuration/db');

/**
 *  @function getAllProduct to get all the products from the list
 */
function getAllProduct() {
    return database.product_overview.findMany({
        select: {
            product_uuid: true,
            units: {
                select: {
                    units_name: true
                }
            },
            product_name: true,
            product_description: true,
            taxonomy: {
                select: {
                    taxonomy_name: true
                }
            },
            product_logo_dir: true,
            product_evidence_product_dir: true,
            product_evidence_tariff_dir: true,
            product_marketing_collateral_dir: true,
            product_profile_link: true,
            product_website_link: true,
            created_at: true,
            updated_at: true
        }
    });
}

/**
 *  @function getProductById to get a product by it's uuid
 */
function getProductByName(name) {
    return database.product_overview.findFirst({
        where: {
            product_name: name
        },
        select: {
            product_uuid: true,
            units: {
                select: {
                    units_name: true
                }
            },
            product_name: true,
            product_description: true,
            taxonomy: {
                select: {
                    taxonomy_name: true
                }
            },
            product_logo_dir: true,
            product_evidence_product_dir: true,
            product_evidence_tariff_dir: true,
            product_marketing_collateral_dir: true,
            product_profile_link: true,
            product_website_link: true,
            created_at: true,
            updated_at: true
        }
    });
}

/**
 *  @function countProduct to get the number of product existed in database
 */
function countProduct() {
    return database.product_overview.count();
}

module.exports = {
    getAllProduct,
    getProductByName,
    countProduct
}