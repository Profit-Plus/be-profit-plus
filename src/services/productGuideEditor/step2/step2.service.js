const { database } = require('../../../helpers/configuration/db');

/**
 *  @function getSegmentingTargetingIdByProductName the id of segmenting targeting based on the product name
 */
function getSegmentingTargetingIdByProductName(name) {
    return database.product_segmenting_targeting.findUnique({
        where: {
            product_overview: {
                product_name: name
            }
        },
        select: {
            segmenting_targeting_uuid: true
        }
    });
}