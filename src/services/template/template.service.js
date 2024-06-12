const { database } = require('../../helpers/utils/db/database');

/**
 * Create a template for product without any data (only be used in step one)
 * @param {Request} product 
 * @returns async function to perform operation
 */
function stepOneTemplate(product) {
    return database.$transaction([
        database.product.create({
            data: {
                product_name: product.productName

            }
        }),
        database.unit_in_charge.create({
            data: {
                product_name: product.productName
            }
        }),
        database.product_files.create({
            data: {
                product_name: product.productName
            }
        })
    ]);
}

/**
 * Create a template for product without any data (only be used in step two)
 * @param {Request} product 
 * @param {Array} pentaHelix 
 */
function stepTwoTemplate(product) {
    return database.$transaction([
        
        database.product_market_potential.create({
            data: {
                product_name: product.productName
            }
        }),
        database.product_positioning_indicator.create({
            data: {
                product_name: product.productName
            }
        }),
        database.product_positioning_user_story.create({
            data: {
                product_name: product.productName
            }
        })
    ]);
}

function pentaHelixTemplate(product, pentaHelix) {
    return database.product_penta_helix.createMany({
        data: {
            product_name: product.productName,
            penta_helix_name: pentaHelix
        }
    });
}

module.exports = {
    stepOneTemplate,
    stepTwoTemplate,
    pentaHelixTemplate
};