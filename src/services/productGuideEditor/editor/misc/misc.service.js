const { penta_helix } = require('@prisma/client');
const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function addNewTaxonomy to add a new name of taxonomy
 */
function addNewTaxonomy(id, taxonomy) {
    return database.taxonomy.create({
        data: {
            taxonomy_uuid: id,
            taxonomy_name: taxonomy.name
        }
    })
}


/**
 * @function getAllTaxonomy to get all the taxonomy from the database
 * @returns {Object} taxonomy
 **/

function getAllTaxonomy() {
    return database.taxonomy.findMany({
        where: {
            taxonomy_name: {
                not: 'undefined' 
            }
        },
        select:{
            taxonomy_name: true
        }
    });
}


// function getAllProduct() {
//     return database.product_overview.findMany({
//         select: {
//             product_uuid: true,
//             units: {
//                 select: {
//                     units_name: true
//                 }
//             },
//             product_name: true,
//             product_description: true,
//             taxonomy: {
//                 select: {
//                     taxonomy_name: true
//                 }
//             },
//             product_logo_dir: true,
//             product_playbook_dir: true,
//             product_marketing_collateral_dir: true,
//             created_at: true,
//             updated_at: true
//         }
//     });
// }

/**
 *  @function getTaxonomyIdByName to get a taxonomy ID based on its name
 */
function getTaxonomyIdByName(name) {
    return database.taxonomy.findUnique({
        where: {
            taxonomy_name: name
        },
        select: {
            taxonomy_uuid: true
        }
    });
}



/**
 *  @function getUnitIDByName to get a unit ID based on its name
 */
function getUnitIDByName(name) {
    return database.units.findUnique({
        where: {
            units_name: name
        },
        select: {
            unit_id: true
        }
    });
}

/**
 *  @function getProductIdByName to get the id of a product based on its name
 */
function getProductIdByName(name) {
    return database.product_overview.findUnique({
        where: {
            product_name: name
        },
        select: {
            product_uuid: true
        }
    });
}

/**
 *  @function getSegmentingTargetingIdByProductName to get the id of segmenting targeting based on the product name
 */
function getSegmentingTargetingIdByProductName(name) {
    return database.product_overview.findUnique({
        where: {
            product_name: name
        },
        select: {
            product_segmenting_targeting: {
                select: {
                    segmenting_targeting_uuid: true
                }
            }
        },
    });
}

/**
 *  @function getSegmentingTargetingPentaHelixId to get the penta helix properties ID based on helix and its segmentingTargetingId
 */
function getSegmentingTargetingPentaHelixId(segmentingTargetingId, helix) {
    return database.segmenting_targeting_penta_helix_properties.findFirst({
        where: {
            AND: {
                segmenting_targeting_uuid: segmentingTargetingId,
                penta_helix: helix.helix
            }
        },
        select: {
            penta_helix_uuid: true
        }
    });
}

/**
 *  @function getProductPositioningIdByProductName to get the id of product positioning based on the product name
 */
function getProductPositioningIdByProductName(name) {
    return database.product_overview.findUnique({
        where: {
            product_name: name
        },
        select: {
            product_positioning: {
                select: {
                    positioning_uuid: true
                }
            }
        }
    });
}

/**
 *  @function getProductOperatingModelIdByProductName to get the id of product operating model based on the product name
 */
function getProductOperatingModelIdByProductName(name) {
    return database.product_overview.findUnique({
        where: {
            product_name: name
        },
        select: {
            product_operating_model: {
                select: {
                    product_operating_model_uuid: true
                }
            }
        }
    });
}


module.exports = {
    addNewTaxonomy,
    getAllTaxonomy,
    getTaxonomyIdByName,
    getUnitIDByName,
    getProductIdByName,
    getSegmentingTargetingIdByProductName,
    getSegmentingTargetingPentaHelixId,
    getProductPositioningIdByProductName,
    getProductOperatingModelIdByProductName
}