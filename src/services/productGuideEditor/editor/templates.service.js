const { product_status } = require('@prisma/client');
const { database } = require('../../../helpers/configuration/db');

/**
 *  @function addProductOverviewTemplate to add a new product overview template contains only a name
 */
function addProductOverviewTemplate(id, unitId, taxonomyId, product) {
    return database.product_overview.create({
        data: {
            product_uuid: id,
            unit_id: unitId,
            taxonomy_uuid: taxonomyId,
            product_name: product.name
        }
    });
}

/**
 *  @function addProductStpdbTemplate to add a new product STPDB template contains only a name
 */
function addProductStpdbTemplate(productId, segmentingTargetingId, positioningId, differentiationBrandingId) {
    return database.$transaction([
        database.product_segmenting_targeting.create({
            data: {
                segmenting_targeting_uuid: segmentingTargetingId,
                product_uuid: productId
            }
        }),
        database.product_positioning.create({
            data: {
                positioning_uuid: positioningId,
                product_uuid: productId
            }
        }),
        database.product_differentiation_branding.create({
            data: {
                differentiation_branding_uuid: differentiationBrandingId,
                product_uuid: productId
            }
        })
    ]);
}

/**
 *  @function addPentaHelixProperties to add a template for penta helix properties
 */
function addPentaHelixProperties(pentaHelixId, segmentingTargetingId, pentaHelixElement) {
    return database.segmenting_targeting_penta_helix_properties.create({
        data: {
            penta_helix_uuid: pentaHelixId,
            segmenting_targeting_uuid: segmentingTargetingId,
            penta_helix: pentaHelixElement
        }
    });
}

/**
 *  @function addSegmentingTargetingMarketPotential to add a new detail of market potential in a segmenting targeting of a product 
 */
function addSegmentingTargetingMarketPotential(id, segmentingTargetingId) {
    return database.segmenting_targeting_market_potential.create({
        data: {
            market_potential_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId,
        }
    });
}

/**
 *  @function addProductPositioningIndicatorsTemplate to add a template for positioning indicators
 */
function addProductPositioningIndicatorsTemplate(positioningId, indicatorId) {
    return database.positioning_indicators.create({
        data: {
            positioning_indicators_uuid: indicatorId,
            positioning_uuid: positioningId
        }
    })
}

/**
 *  @function addProductPositioningStoryTemplate to add the stories text of product positioning
 */
function addProductPositioningStoryTemplate(storyId, positioningId) {
    return database.product_positioning_story.create({
        data: {
            product_positioning_story_uuid: storyId,
            positioning_uuid: positioningId
        }
    });
}

/**
 *  @function addProductOperatingModelTemplate to add a new product operating model template contains only an ID 
 */
function addProductOperatingModelTemplate(productId, operatingModelId) {
    return database.product_operating_model.create({
        data: {
            product_operating_model_uuid: operatingModelId,
            product_uuid: productId,
        }
    });
}

/**
 *  @function addProductOperatingModelGtmHostTemplate to add a new product operating model GTM Host template contains only an ID 
 */
function addProductOperatingModelGtmHostTemplate(id, operatingModelId) {
    return database.product_op_gtm_host.create({
        data: {
            product_gtm_host_uuid: id,
            product_operating_model_uuid: operatingModelId
        }
    });
}

/**
 *  @function addProductOperatingModelOrganizationHeaderTemplate to add a new template for organization header in product operating model
 */
function addProductOperatingModelOrganizationHeaderTemplate(id, operatingModelId) {
    return database.product_op_organization_header.create({
        data: {
            product_op_organization_header_uuid: id,
            product_operating_model_uuid: operatingModelId
        }
    });
}

/**
 *  @function addProductReadinessStatus to add a new readiness status template of a product
 */
function addProductReadinessStatus(id, productId) {
    return database.product_readiness_status.create({
        data: {
            product_readiness_status_uuid: id,
            product_uuid: productId,
            product_status: product_status.DEFINE,
        }
    });
}

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
            product_playbook_dir: true,
            product_marketing_collateral_dir: true,
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
            product_playbook_dir: true,
            product_marketing_collateral_dir: true,
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
    addProductOverviewTemplate,
    addProductStpdbTemplate,
    addPentaHelixProperties,
    addSegmentingTargetingMarketPotential,
    addProductPositioningStoryTemplate,
    addProductPositioningIndicatorsTemplate,
    addProductOperatingModelTemplate,
    addProductOperatingModelGtmHostTemplate,
    addProductOperatingModelOrganizationHeaderTemplate,
    addProductReadinessStatus,
    getAllProduct,
    getProductByName,
    countProduct
}