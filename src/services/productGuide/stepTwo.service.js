const { database } = require('../../helpers/utils/db/database');

/**
 * Add the penta helix segmenting-targeting details of the product
 * @param {String} productName 
 * @param {Array} pentaHelix 
 */
function updatePentahelixDetails(productName, pentaHelix) {
    return database.product_penta_helix.updateMany({
        where: {
            product_name: productName,
            penta_helix_name: pentaHelix.helixName,
        },
        data: {
            penta_helix_desc: pentaHelix.description,
            penta_helix_visibility: pentaHelix.visibility,
            targeting_user_desc: pentaHelix.userDescription
        }
    });
}

/**
 * Add the horizontal axis of the segmenting-targeting map (benefits)
 * @param {String} productName 
 * @param {Array} benefits 
 */
function addSegmentingTargetingBenefits(productName, benefits) {
    return database.product_segmenting_targeting_benefit.createMany({
        data: {
            product_name: productName,
            benefit_description: benefits.description
        }
    });
}

/**
 * Add the details of every legend in segmenting-targeting map
 * @param {String} productName 
 * @param {Array} legends 
 */
function addSegmentingTargetingLegends(productName, legends) {
    return database.product_segmenting_targeting_legend.createMany({
        data: {
            product_name: productName,
            legend_name: legends.legendName,
            hue_value: legends.hueValue,
            saturation_value: legends.saturationValue,
            lightness_value: legends.lightnessValue,
            x_position: legends.xPosition,
            y_position: legends.yPosition
        }
    });
}

/**
 * Service function to add market potential details of the product
 * @param {String} productName 
 * @param {Array} marketPotential 
 */
function updateProductMarketPotential(productName, marketPotential) {
    return database.product_market_potential.update({
        where: {
            product_name: productName
        },
        data: {
            sam_value: marketPotential.sam,
            som_value: marketPotential.som,
            tam_value: marketPotential.tam
        }
    });
}

/**
 * Service function to add product positioning indicators
 * @param {String} productName 
 * @param {Array} indicators 
 * @returns 
 */
function updateProductPositioningIndicator(productName, positioningIndicators) {
    return database.product_positioning_indicator.update({
        where: {
            product_name: productName
        },
        data: {
            indicator_one_value: positioningIndicators.indicatorOne,
            indicator_two_value: positioningIndicators.indicatorTwo,
            indicator_three_value: positioningIndicators.indicatorThree,
            indicator_four_value: positioningIndicators.indicatorFour,
        }
    });
}

/**
 * Service function to check the availibility of the name.
 * If a picture name has already been existed in a product, function will return null value
 * @param {String} productName 
 * @param {String} pictureName 
 * @returns 
 */
function checkPositioningPictureAvailibility(productName, pictureName) {
    return database.product_positioning_pictures.findFirst({
        where: {
            product_name: productName,
            picture_name: pictureName
        }
    });
}

/**
 * Service function to add details of positioning pictures of a product
 * @param {Object} picture
 */
function addProductPositioningPictures(pictureDetail) {
    return database.product_positioning_pictures.create({
        data: {
            product_name: pictureDetail.productName,
            picture_name: pictureDetail.pictureName,
            picture_dir: pictureDetail.pictureDir,
            product_desc: pictureDetail.pictureDescription,
            x_position: pictureDetail.xPosition,
            y_position: pictureDetail.yPosition
        }
    });
}

function updateProductPositioningUserStory(productName, userStory) {
    return database.product_positioning_user_story.update({
        where: {
            product_name: productName
        },
        data: {
            desc_1: userStory.desc1,
            desc_2: userStory.desc2,
            desc_3: userStory.desc3,
            desc_4: userStory.desc4,
            desc_5: userStory.desc5,
        }
    });
}

module.exports = {
    updatePentahelixDetails,
    addSegmentingTargetingBenefits,
    addSegmentingTargetingLegends,
    updateProductMarketPotential,
    updateProductPositioningIndicator,
    checkPositioningPictureAvailibility,
    addProductPositioningPictures,
    updateProductPositioningUserStory
}