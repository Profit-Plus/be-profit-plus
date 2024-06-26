const { add } = require('winston');
const { database } = require('../../../../helpers/configuration/db');
const { get } = require('../../../../routes/authentication/auth.routes');

/**
 *  @function addPentaHelixProperties to update the detail of penta helix in a segmenting targeting product
 */
function addSegmentingTargetingPentaHelixProperties(pentaHelixId, pentaHelix) {
    return database.segmenting_targeting_penta_helix_properties.update({
        where: {
            penta_helix_uuid: pentaHelixId
        },
        data: {
            penta_helix_desc: pentaHelix.penta_helix_desc,
            penta_helix_user_desc: pentaHelix.penta_helix_user_desc,
            penta_helix_status: pentaHelix.penta_helix_status
        },
    });
}

function getSegmentingTargetingPentaHelixProperties(segmentingTargetingId) {
    return database.segmenting_targeting_penta_helix_properties.findMany({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function updateSegmentingTargetingPentaHelixProperties(pentaHelixId, pentaHelix) {
    console.log(pentaHelixId, pentaHelix.penta_helix_desc, pentaHelix.penta_helix_user_desc, pentaHelix.penta_helix_status)
    return database.segmenting_targeting_penta_helix_properties.update({
        where: {
            penta_helix_uuid: pentaHelixId
        },
        data: {
            penta_helix_desc: pentaHelix.penta_helix_desc,
            penta_helix_user_desc: pentaHelix.penta_helix_user_desc,
            penta_helix_status: pentaHelix.penta_helix_status
        }
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
            feature_desc: features.feature_desc
        }
    });
}

function getSegmentingTargetingFeatureUsed(segmentingTargetingId) {
    return database.segmenting_targeting_feature_used.findMany({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function getSegmentingTargetingFeatureUsedById(id, segmentingTargetingId) {
    return database.segmenting_targeting_feature_used.findUnique({
        where: {
            feature_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function updateSegmentingTargetingFeatureUsed(id, segmentingTargetingId, features) {
    return database.segmenting_targeting_feature_used.update({
        where: {
            feature_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
        },
        data: {
            feature_desc: features.feature_desc
        }
    });
}

function deleteSegmentingTargetingFeatureUsed(id, segmentingTargetingId) {
    return database.segmenting_targeting_feature_used.delete({
        where: {
            feature_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
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
            legend_name: legends.legend_name,
            legend_color_code: legends.legend_color_code,
        }
    });
}

function getSegmentingTargetingLegends(segmentingTargetingId) {
    return database.segmenting_targeting_legends.findMany({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function getSegmentingTargetingLegendsById(id, segmentingTargetingId) {
    return database.segmenting_targeting_legends.findUnique({
        where: {
            legends_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}


function updateSegmentingTargetingLegends(id, segmentingTargetingId, legends) {
    return database.segmenting_targeting_legends.update({
        where: {
            legends_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
        },
        data: {
            legend_name: legends.legend_name,
            legend_color_code: legends.legend_color_code,
        }
    });
}

function deleteSegmentingTargetingLegends(id, segmentingTargetingId) {
    return database.segmenting_targeting_legends.delete({
        where: {
            legends_uuid: id,
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function addSegmentingTargetingLegendPos(id, legendsId, pentaHelixId, featureId) {
    console.log(id, legendsId, pentaHelixId, featureId)
    return database.segmenting_targeting_legends_pos.create({
        data: {
            legends_pos_uuid: id,
            legends_uuid: legendsId,
            penta_helix_uuid: pentaHelixId,
            feature_uuid: featureId
        }
    });
}

function getSegmentingTargetingLegendPos(featureId) {
    return database.segmenting_targeting_legends_pos.findMany({
        where: {
            feature_uuid: featureId
        }
    });
}

function getSegmentingTargetingLegendPosById(pentaHelixId, featureId) {
    return database.segmenting_targeting_legends_pos.findFirst({
        where: {
            penta_helix_uuid: pentaHelixId,
            feature_uuid: featureId,
        }
    });
}

function updateSegmentingTargetingLegendPos(id, legendsId) {
    return database.segmenting_targeting_legends_pos.update({
        where: {
            legends_pos_uuid: id,
        },
        data: {
            legends_uuid: legendsId,
        }
    });
}

function deleteSegmentingTargetingLegendPos(id) {
    console.log(id)
    return database.segmenting_targeting_legends_pos.delete({
        where: {
            legends_pos_uuid: id,
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

function getSegmentingTargetingMarketPotential(segmentingTargetingId) {
    return database.segmenting_targeting_market_potential.findUnique({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId
        }
    });
}

function updateSegmentingTargetingMarketPotential(segmentingTargetingId, marketPotential) {
    return database.segmenting_targeting_market_potential.update({
        where: {
            segmenting_targeting_uuid: segmentingTargetingId
        },
        data: {
            tam_desc: marketPotential.tam_desc,
            sam_desc: marketPotential.sam_desc,
            som_desc: marketPotential.som_desc
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
            indicator_one_name: indicators.indicator_one_name,
            indicator_two_name: indicators.indicator_two_name,
            indicator_three_name: indicators.indicator_three_name,
            indicator_four_name: indicators.indicator_four_name
        }
    });
}

function getPositioningIndicators(positioningId) {
    return database.positioning_indicators.findUnique({
        where: {
            positioning_uuid: positioningId
        }
    });
}

function updatePositioningIndicators(positioningId, indicators) {
    return database.positioning_indicators.update({
        where: {
            positioning_uuid: positioningId
        },
        data: {
            indicator_one_name: indicators.indicator_one_name,
            indicator_two_name: indicators.indicator_two_name,
            indicator_three_name: indicators.indicator_three_name,
            indicator_four_name: indicators.indicator_four_name
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
            sentence_one_market_target: story.sentence_one_market_target,
            sentence_two_use_case: story.sentence_two_use_case,
            sentence_three_name_product: story.sentence_three_name_product,
            sentence_four_differentiation: story.sentence_four_differentiation,
            sentence_five_reason: story.sentence_five_reason
        }
    });
}

function getPositioningStory(positioningId) {
    return database.product_positioning_story.findUnique({
        where: {
            positioning_uuid: positioningId
        }
    });
}

function updatePositioningStory(positioningId, story) {
    return database.product_positioning_story.update({
        where: {
            positioning_uuid: positioningId
        },
        data: {
            sentence_one_market_target: story.sentence_one_market_target,
            sentence_two_use_case: story.sentence_two_use_case,
            sentence_three_name_product: story.sentence_three_name_product,
            sentence_four_differentiation: story.sentence_four_differentiation,
            sentence_five_reason: story.sentence_five_reason
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
            logo_name: logoProperties.logo_name,
            logo_desc: logoProperties.logo_desc,
            logo_dir: logoProperties.logo_dir,
            logo_pos_x: logoProperties.logo_pos_x,
            logo_pos_y: logoProperties.logo_pos_y
        }
    });
}

function getPositioningPictures(positioningId) {
    return database.positioning_logos.findMany({
        where: {
            positioning_uuid: positioningId
        }
    });
}

function getPositioningPicturesById(id, positioningId) {
    return database.positioning_logos.findUnique({
        where: {
            positioning_logos_uuid: id,
            positioning_uuid: positioningId
        }
    });
}

function updatePositioningPictures(id, positioningId, logoProperties) {
    return database.positioning_logos.update({
        where: {
            positioning_logos_uuid: id,
            positioning_uuid: positioningId
        },
        data: {
            logo_name: logoProperties.logo_name,
            logo_desc: logoProperties.logo_desc,
            logo_dir: logoProperties.logo_dir,
            logo_pos_x: logoProperties.logo_pos_x,
            logo_pos_y: logoProperties.logo_pos_y
        }
    });
}

function deletePositioningPictures(id, positioningId) {
    return database.positioning_logos.delete({
        where: {
            positioning_logos_uuid: id,
            positioning_uuid: positioningId
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
            product_differentiation_desc: data.product_differentiation_desc,
            product_differentiation_slogan: data.product_differentiation_slogan
        }
    });
}

function getDifferentiationBranding(productId) {
    return database.product_differentiation_branding.findUnique({
        where: {
            product_uuid: productId
        }
    });
}

function updateDifferentiationBranding(productId, data) {
    return database.product_differentiation_branding.update({
        where: {
            product_uuid: productId
        },
        data: {
            product_differentiation_desc: data.product_differentiation_desc,
            product_differentiation_slogan: data.product_differentiation_slogan
        }
    });
}

module.exports = {
    addSegmentingTargetingPentaHelixProperties,
    getSegmentingTargetingPentaHelixProperties,
    updateSegmentingTargetingPentaHelixProperties,
    addSegmentingTargetingFeatureUsed,
    getSegmentingTargetingFeatureUsed,
    getSegmentingTargetingFeatureUsedById,
    updateSegmentingTargetingFeatureUsed,
    deleteSegmentingTargetingFeatureUsed,
    addSegmentingTargetingLegends,
    getSegmentingTargetingLegends,
    getSegmentingTargetingLegendsById,
    updateSegmentingTargetingLegends,
    deleteSegmentingTargetingLegends,
    addSegmentingTargetingLegendPos,
    getSegmentingTargetingLegendPos,
    getSegmentingTargetingLegendPosById,
    updateSegmentingTargetingLegendPos,
    deleteSegmentingTargetingLegendPos,
    addSegmentingTargetingMarketPotential,
    getSegmentingTargetingMarketPotential,
    updateSegmentingTargetingMarketPotential,
    addPositioningIndicators,
    getPositioningIndicators,
    updatePositioningIndicators,
    addPositioningStory,
    getPositioningStory,
    updatePositioningStory,
    addPositioningPictures,
    getPositioningPictures,
    getPositioningPicturesById,
    updatePositioningPictures,
    deletePositioningPictures,
    addDifferentiationBranding,
    getDifferentiationBranding,
    updateDifferentiationBranding
}