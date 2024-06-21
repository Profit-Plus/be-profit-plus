const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function addProductTariffing to add tariffin schema of a product
 */
function addProductTariffing(id, productId, details) {
    return database.product_tariffing_packets.create({
        data: {
            product_tariffing_packets_uuid: id,
            product_uuid: productId,
            feature: details.feature,
            tariff: details.tariff,
            payment_schema: details.paymentSchema
        }
    });
}

module.exports = {
    addProductTariffing
}