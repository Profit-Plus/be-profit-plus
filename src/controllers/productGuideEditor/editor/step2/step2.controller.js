const stepTwoService = require('../../../../services/productGuideEditor/editor/step2/step2.service');
const miscService = require('../../../../services/productGuideEditor/editor/misc/misc.service');
const response = require('../../../../helpers/web/webResponses');

const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');

/**
 *  @function segmentingTargetingController update and and add some details in a segmenting-targeting of a product 
 *  these controller represents the all datas in the segmenting-targeting graph 
 */
async function segmentingTargetingController(req, res, next) {
    console.log('Called here')
    try {
        /* Initialize request body and param */
        const productName = String(req.query.product);
        const { pentaHelix, features, featurePoses: legendPoses, legends, marketPotential, differBranding, positioningIndicators} = req.body;
        
        const productId = (await miscService.getProductIdByName(productName)).product_uuid;
        /* Get the segmenting-targeting properties */
        const segmentingTargetingId = (await miscService.getSegmentingTargetingIdByProductName(productName)).product_segmenting_targeting.segmenting_targeting_uuid;

        /* Add penta helix properties to database */
        await Promise.all(pentaHelix.map(async (helix) => {
            /* Get the penta_helix_uuid */
            const pentaHelixId = (await miscService.getSegmentingTargetingPentaHelixId(segmentingTargetingId, helix)).penta_helix_uuid;
            await stepTwoService.updateSegmentingTargetingPentaHelixProperties(pentaHelixId, helix);
        }));

        const getFeatures = await stepTwoService.getSegmentingTargetingFeatureUsed(segmentingTargetingId);

        if (features && features.length > 0) {
            await Promise.all(getFeatures.map(async (item) => {
                if (!features.find(feature => feature.feature_uuid === item.feature_uuid)) {
                    await stepTwoService.deleteSegmentingTargetingFeatureUsed(item.feature_uuid, segmentingTargetingId);
                    features.pop(item);
                }
            }));
            await Promise.all(features.map(async (item) => {
                if (!item.feature_uuid || item.feature_uuid === '') {
                    const id = uuidv4();
                    await stepTwoService.addSegmentingTargetingFeatureUsed(id, segmentingTargetingId, item);
                } else {
                    const feature = await stepTwoService.getSegmentingTargetingFeatureUsedById(item.feature_uuid, segmentingTargetingId);
                    if (!feature) {
                        const id = uuidv4();
                        await stepTwoService.addSegmentingTargetingFeatureUsed(id, segmentingTargetingId, item);
                    } else {
                        await stepTwoService.updateSegmentingTargetingFeatureUsed(item.feature_uuid, segmentingTargetingId, item);
                    }
                }
            }));
        }

        /* Add legends from segmenting-targeting graph */
        if (legends && legends.length > 0) {
            const getLegends = await stepTwoService.getSegmentingTargetingLegends(segmentingTargetingId);
            await Promise.all(getLegends.map(async (item) => {
                if (!legends.find(legend => legend.legends_uuid === item.legends_uuid)) {
                    await stepTwoService.deleteSegmentingTargetingLegends(item.legends_uuid, segmentingTargetingId);
                }
            }));

            await Promise.all(legends.map(async (item) => {
                if (!item.legends_uuid || item.legends_uuid === '') {
                    const id = uuidv4();
                    await stepTwoService.addSegmentingTargetingLegends(id, segmentingTargetingId, item);
                } else {
                    const legend = await stepTwoService.getSegmentingTargetingLegendsById(item.legends_uuid, segmentingTargetingId);
                    if (!legend) {
                        const id = uuidv4();
                        await stepTwoService.addSegmentingTargetingLegends(id, segmentingTargetingId, item);
                    } else {
                        await stepTwoService.updateSegmentingTargetingLegends(item.legends_uuid, segmentingTargetingId, item);
                    }
                }
            }));
        }
        
        
        if (legendPoses && legendPoses.length > 0) {
            const getFeatures = await stepTwoService.getSegmentingTargetingFeatureUsed(segmentingTargetingId);
            await Promise.all(getFeatures.map(async (feature) => {
                const getLegendPoses = await stepTwoService.getSegmentingTargetingLegendPos(feature.feature_uuid);
                await Promise.all(getLegendPoses.map(async (item) => {
                    if (!legendPoses.find(legendPos => legendPos.legends_pos_uuid === item.legends_pos_uuid)) {
                        await stepTwoService.deleteSegmentingTargetingLegendPos(item.legends_pos_uuid);
                    }
                }));
            }));

            await Promise.all(legendPoses.map(async (item) => {
                if (!item.legends_pos_uuid || item.legends_pos_uuid === '') {
                    const id = uuidv4();
                    await stepTwoService.addSegmentingTargetingLegendPos(id, item.legends_uuid, item.penta_helix_uuid, item.feature_uuid);
                } else {
                    const legendPos = await stepTwoService.getSegmentingTargetingLegendPosById(item.penta_helix_uuid, item.feature_uuid);
                    if (!legendPos) {
                        const id = uuidv4();
                        await stepTwoService.addSegmentingTargetingLegendPos(id, item.legends_uuid, item.penta_helix_uuid, item.feature_uuid);
                    } else {
                        await stepTwoService.updateSegmentingTargetingLegendPos(legendPos.legends_pos_uuid, item.legends_uuid);
                    }
                }
            }));
        }

        /* Add market potential */
        if (marketPotential) {
            await stepTwoService.addSegmentingTargetingMarketPotential(segmentingTargetingId, marketPotential);
        }

        if (differBranding) {
            await stepTwoService.addDifferentiationBranding(productId, differBranding);
        }

        if (positioningIndicators) {
            const positioningId = (await miscService.getProductPositioningIdByProductName(productName)).product_positioning.positioning_uuid;
            await stepTwoService.addPositioningIndicators(positioningId, positioningIndicators);
        }

        res.status(200).json(response.successResponse('New segmenting targeting updated!'));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_segmenting_targeting')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

/**
 *  @description Product positioning feature split into two API. One API used to handle the raw data request and the other used to
 *  handle form data request. The API for the form data request will be called redudantly on the front end side depending on the 
 *  pictures that will be uploaded to positioning diagram.
 */

async function getSTPDBController(req, res, next) {
    try {
        /* Initialize request param */
        const productName = String(req.query.product);
        const product = await miscService.getProductIdByName(productName);

        const productLogoFormat = (await miscService.getProductLogoDirByName(productName)).product_logo_dir.split('.')[1];
        /* Get the segmenting-targeting properties */
        const segmentingTargetingId = (await miscService.getSegmentingTargetingIdByProductName(productName)).product_segmenting_targeting.segmenting_targeting_uuid;

        /* Get the penta helix properties */
        const pentaHelix = await stepTwoService.getSegmentingTargetingPentaHelixProperties(segmentingTargetingId);

        /* Get the feature used */
        const features = await stepTwoService.getSegmentingTargetingFeatureUsed(segmentingTargetingId);

        /* Get the legends */
        const legends = await stepTwoService.getSegmentingTargetingLegends(segmentingTargetingId);

        
        var sendLegendPoses = [];
        await Promise.all(features.map(async (feature) => {
            const legendPos = await stepTwoService.getSegmentingTargetingLegendPos(feature.feature_uuid);
            await Promise.all(legendPos.map((item) => {
                sendLegendPoses.push(item);
            }))
        }));
        
        /* Get the market potential */
        const marketPotential = await stepTwoService.getSegmentingTargetingMarketPotential(segmentingTargetingId);
        
        const differentiationBranding = await stepTwoService.getDifferentiationBranding(product.product_uuid);

        const positioningId = (await miscService.getProductPositioningIdByProductName(productName)).product_positioning.positioning_uuid;
        
        const positioningIndicators = await stepTwoService.getPositioningIndicators(positioningId);

        const positioningPictures = await stepTwoService.getPositioningPictures(positioningId);

        const positioningStory = await stepTwoService.getPositioningStory(positioningId);

        res.status(200).json(response.successResponse('Segmenting targeting fetched', {
            pentaHelix: pentaHelix,
            features: features,
            legends: legends,
            legendPoses: sendLegendPoses,
            marketPotential: marketPotential,
            differentiationBranding: differentiationBranding,
            positioningIndicators: positioningIndicators,
            positioningPictures: positioningPictures,
            positioningStory: positioningStory,
            productLogo: 'http://localhost:3001/product/logo/'+ productName + '.' + productLogoFormat
        }));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_segmenting_targeting')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

/**
 *  @function positioningRawDataController update and and add some details in a segmenting-targeting of a product 
 */
async function positioningRawDataController(req, res, next) {
    try {
        /* Initialize request body and param */
        const productName = String(req.query.product);
        const indicators = req.body.indicators;
        const story = req.body.story;

        /* Get the positioning ID based on the product name in query param */
        const positioningId = (await miscService.getProductPositioningIdByProductName(productName)).product_positioning.positioning_uuid;

        /* Store indicators of product positioning graph */
        await stepTwoService.addPositioningIndicators(positioningId, indicators);

        /* Store the product positioning story */
        await stepTwoService.addPositioningStory(positioningId, story);

        res.status(200).json(response.successResponse('New product positioning updated!'));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_positioning')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

async function getPositioningRawDataController(req, res, next) {
    try {
        /* Initialize request param */
        const productName = String(req.query.product);

        /* Get the positioning ID based on the product name in query param */
        const positioningId = (await miscService.getProductPositioningIdByProductName(productName)).product_positioning.positioning_uuid;

        /* Get the indicators of product positioning graph */
        const indicators = await stepTwoService.getPositioningIndicators(positioningId);

        /* Get the product positioning story */
        const story = await stepTwoService.getPositioningStory(positioningId);

        res.status(200).json(response.successResponse('Product positioning fetched', {
            indicators: indicators,
            story: story
        }));

    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_positioning')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

/**
 *  @function positioningFormDataController update and and add some details in a segmenting-targeting of a product 
 */
async function positioningFormDataController(req, res, next) {
    try {
        /* Initialize the instance of formidable */
        const form = new formidable.IncomingForm();

        /* Parse the file to server */
        form.parse(req, async function(error, fields, files) {
            if (error) {
                res.status(422).json(response.errorResponse('File parsing system failed'));
                next();

            } else {
                /* Initialize fields and param */
                const productName = String(req.query.product);
                const logoName = String(fields.name).toLowerCase();
                const logoDescription = String(fields.description);
                const logoPosX = Number(fields.x);
                const logoPosY = Number(fields.y);

                /* Generate UUID for logo and get the positioning ID based on query param */
                const positioningId = (await miscService.getProductPositioningIdByProductName(productName)).product_positioning.positioning_uuid;
                const logoId = uuidv4();

                /* Check the extension of the logo */
                const logoExtension = files.logo[0].originalFilename.split('.').pop();
                const allowedExtension = ['jpg', 'jpeg', 'png', 'pjpeg', 'pjp'];

                /* Get the old path of the file */
                const oldLogoPath = files.logo[0].filepath;

                if (allowedExtension.includes(logoExtension)) {
                    /* Set the name of the product from query param as a folder name */
                    const saveDir = path.join('resources', 'uploads', 'positioning', productName);
                    /* Create directory if doesn't exist */
                    filestream.mkdirSync(saveDir, { recursive: true});

                    /* Create the complete directory of the logo */
                    const newPictureFileName = `${logoId}_${Date.now()}` + '.' + logoExtension.toString();
                    const newLogoPath = saveDir + '\\' + newPictureFileName;
                    const completeLogoPath = 'profit-plus-api\\src\\' + newLogoPath;

                    /* Perform file uploading */
                    mv (oldLogoPath, newLogoPath, async function (error) {
                        if (error) {
                            res.status(409).json(response.errorResponse(`Uploading failed for id ${logoId}`));
                            next(error);

                        } else {
                            /* Initialize property object for database */
                            const properties = {
                                name: logoName,
                                description: logoDescription,
                                directory: completeLogoPath,
                                posX: logoPosX,
                                posY: logoPosY
                            }

                            /* Store data to database */
                            await stepTwoService.addPositioningPictures(logoId, positioningId, properties);

                            res.status(200).json(response.successResponse('Picture successfully uploaded'));
                        }
                    });

                } else {
                    res.status(409).json(response.errorResponse('Invalid file extension'));
                    next(error);
                }
            }
        });
        
    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_positioning')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

/**
 *  @function differentiationBrandingController update and and add some details in a segmenting-targeting of a product 
 */
async function differentiationBrandingController(req, res, next) {
    try {
        /* Initialize request body and request param */
        const productName = String(req.query.product);
        const data = req.body.data;

        /* Get the id of the product */
        const productId = (await miscService.getProductIdByName(productName)).product_uuid;

        /* Store data to database */
        await stepTwoService.addDifferentiationBranding(productId, data);

        res.status(200).json(response.successResponse('Differentiation and branding successfully updated'));

    } catch (error) {
        if (error.code === 'P2003') {
            res.status(400).json(response.errorResponse('Bad request'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error!'));
        }
        
        next(error);
    }
}

module.exports = {
    segmentingTargetingController,
    getSTPDBController,
    positioningRawDataController,
    positioningFormDataController,
    differentiationBrandingController
}