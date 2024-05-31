const productTemplateService = require('../../services/productGuideEditor/templates.service');
const miscService = require('../../services/productGuideEditor/misc/misc.service');
const responses = require('../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

/**
 *  @function addNewProduct to add a new name of a product
 */
async function addNewProduct(req, res, next) {
    try {
        /* Initialize request body */
        const product = req.body;

        /* Initialize uuid for each services */
        const productUuid = uuidv4();
        const segmentingTargetingUuid = uuidv4();
        const positioningUuid = uuidv4();
        const differentiationBrandingUuid = uuidv4();

        /* Initialize uuid for sub-services */
        const indiciatorUuid = uuidv4();
        const storyUuid = uuidv4();
    
        /* Initialize penta helix array */
        const pentaHelixArray = [
            "BUSINESS", "ACADEMY", "TECH_PROVIDER", "GOVERNMENT", "COMMUNITY", "SUBDIARIES"
        ]

        /* Get unit ID and taxonomy ID by their name */
        const unitId = await miscService.getUnitIDByName('undefined');
        const taxonomyId = await miscService.getTaxonomyIdByName('undefined');

        /* Add a new template for product overview */
        await productTemplateService.addProductOverviewTemplate(productUuid, unitId.unit_id, taxonomyId.taxonomy_uuid, product);

        /* Add a new template for product STPDB */
        await productTemplateService.addProductStpdbTemplate(
            productUuid, 
            segmentingTargetingUuid, 
            positioningUuid, 
            differentiationBrandingUuid
        );
        
        /* Add a new template for STPDB sub-services */
        await productTemplateService.addProductPositioningIndicatorsTemplate(positioningUuid, indiciatorUuid);
        await productTemplateService.addProductPositioningStoryTemplate(storyUuid, positioningUuid);
        
        await Promise.all(pentaHelixArray.map(async (element) => {
            const pentaHelixUuid = uuidv4();
            await productTemplateService.addPentaHelixProperties(pentaHelixUuid, segmentingTargetingUuid, element);
        }));
            
        res.status(200).json(responses.successResponse('New product added!', product));
        
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json(responses.errorResponse('Duplicate name of product!'));

        } else {
            res.status(500).json(responses.errorResponse('Internal Server error!'));
        }

        next(error);
    }
}

module.exports = {
    addNewProduct
}