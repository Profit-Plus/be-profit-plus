const { database } = require('../../../helpers/configuration/db');

function getAllProduct() {
    return database.product_overview.findMany({
        select: {
            product_uuid: true,
            product_name: true,
            taxonomy: {
                select: {
                    taxonomy_name: true
                }
            },
            product_logo_dir: true
        }
    });
}

module.exports = {
    getAllProduct
}