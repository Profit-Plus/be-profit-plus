const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function updateProductReadiness to update the readiness status of the product
 */
function updateProductReadiness(productId, status) {
    return database.product_readiness_status.update({
        where: {
            product_uuid: productId
        },
        data: {
            product_status: status
        }
    });
}

/**
 *  @function addProductReadinessDescription to add a description for each status in a product 
 */
function addProductReadinessDescription(id, productId, description) {
    return database.product_readiness_description.create({
        data: {
            product_readiness_description_uuid: id,
            product_uuid: productId,
            product_status: description.status,
            analysis_description: description.analysis,
            next_step_description: description.nextStep
        }
    });
}

module.exports = {
    updateProductReadiness,
    addProductReadinessDescription
}