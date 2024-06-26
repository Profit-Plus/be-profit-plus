const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function addPentaHelixProperties to update the detail of penta helix in a segmenting targeting product
 */
function addSegmentingTargetingPentaHelixProperties(pentaHelixId, pentaHelix) {
    return database.segmenting_targeting_penta_helix_properties.update({
        where: {
            penta_helix_uuid: pentaHelixId
        },
        data: {
            penta_helix_desc: pentaHelix.description,
            penta_helix_user_desc: pentaHelix.userDescription,
            penta_helix_status: pentaHelix.status
        },
    });
}

/**
 *  @function addSegmentingTargetingFeatureUsed to add a feature in a segmenting targeting of a product
 */
function addSegmentingTargetingFeatureUsed(id, segmentingTargetingId, features) {
    return database.segmenting_targeting_feature_used.create({
        data: {
            feature_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId,
            feature_desc: features.description
        }
    });
}

/**
 *  @function addSegmentingTargetingLegends to add a new legend in a segmenting targeting of a product 
 */
function addSegmentingTargetingLegends(id, segmentingTargetingId, legends) {
    return database.segmenting_targeting_legends.create({
        data: {
            legends_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId,
            legend_name: legends.name,
            legend_color_code: legends.colorCode,
            legend_pos_x: legends.posX,
            legend_pos_y: legends.posY
        }
    });
}

/**
 *  @function addSegmentingTargetingMarketPotential to add a details of market potential in a segmenting-targeting of a product
 */
function addSegmentingTargetingMarketPotential(segmentingTargetingId, marketPotential) {
    return database.segmenting_targeting_market_potential.update({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId,
        },
        data: {
            tam_desc: marketPotential.tam,
            sam_desc: marketPotential.sam,
            som_desc: marketPotential.som
        }
    });
}

/**
 *  @function addPositioningIndicators to add indicators of product positioning 
 */
function addPositioningIndicators(positioningId, indicators) {
    return database.positioning_indicators.update({
        where: {
            positioning_uuid: positioningId
        },
        data: {
            indicator_one_name: indicators.indicatorOne,
            indicator_two_name: indicators.indicatorTwo,
            indicator_three_name: indicators.indicatorThree,
            indicator_four_name: indicators.indicatorFour
        }
    });
}

/**
 *  @function addPositioningStory to add indicators of product positioning 
 */
function addPositioningStory(positioningId, story) {
    return database.product_positioning_story.update({
        where: {
            positioning_uuid: positioningId
        },
        data: {
            sentence_one_market_target: story.marketTarget,
            sentence_two_use_case: story.useCase,
            sentence_three_name_product: story.productName,
            sentence_four_differentiation: story.differentiation,
            sentence_five_reason: story.reason
        }
    });
}

/**
 *  @function addPositioningPicture to add a picture in product positioning diagram  
 */
function addPositioningPictures(id, positioningId, logoProperties) {
    return database.positioning_logos.create({
        data: {
            positioning_logos_uuid: id,
            positioning_uuid: positioningId,
            logo_name: logoProperties.name,
            logo_desc: logoProperties.description,
            logo_dir: logoProperties.directory,
            logo_pos_x: logoProperties.posX,
            logo_pos_y: logoProperties.posY
        }
    });
}

/**
 *  @function addDifferentiationBranding to add the differentian and branding details
 */
function addDifferentiationBranding(productId, data) {
    return database.product_differentiation_branding.update({
        where: {
            product_uuid: productId
        },
        data: {
            product_differentiation_desc: data.description,
            product_differentiation_slogan: data.slogan
        }
    });
}

module.exports = {
    addSegmentingTargetingPentaHelixProperties,
    addSegmentingTargetingFeatureUsed,
    addSegmentingTargetingLegends,
    addSegmentingTargetingMarketPotential,
    addPositioningIndicators,
    addPositioningStory,
    addPositioningPictures,
    addDifferentiationBranding
}