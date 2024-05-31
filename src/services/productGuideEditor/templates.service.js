const { database } = require('../../helpers/configuration/db');

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
 *  @function addProductStpdbTemplate to add a new product segmenting targeting template contains only a name
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

function addProductPositioningStoryTemplate(storyId, positioningId) {
    return database.product_positioning_story.create({
        data: {
            product_positioning_story_uuid: storyId,
            positioning_uuid: positioningId
        }
    });
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

module.exports = {
    addProductOverviewTemplate,
    addProductStpdbTemplate,
    addProductPositioningStoryTemplate,
    addProductPositioningIndicatorsTemplate,
    addPentaHelixProperties
}