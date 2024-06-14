const stepSixService = require('../../../services/productGuideEditor/step6/step6.service');
const miscService = require('../../../services/productGuideEditor/misc/misc.service');
const response = require('../../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

async function addProductReadinesStatus(req, res, next) {
    try {
        /* Initialize query param and request body */
        const productName = String(req.query.product).toLowerCase();
        const status = String(req.body.status).toUpperCase();
        const desc = req.body.description;

        /* Initilialize product readiness constants (based on the enum in database) */
        const readinessStatus = ['DEFINE', 'DESIGN', 'DEVELOP', 'DEPLOY', 'DELIVER'];

        /* Get the product Id by its name */
        const productId = (await miscService.getProductIdByName(productName)).product_uuid;

        /* Update product readiness status */
        if (readinessStatus.includes(status)) {
            await stepSixService.updateProductReadiness(productId, status);
        }

        /* add description to product readiness */
        await Promise.all(desc.map(async (detail) => {
            if (readinessStatus.includes(String(detail.status).toUpperCase())) {
                /* Generate UUID */
                const id = uuidv4();
                await stepSixService.addProductReadinessDescription(id, productId, detail);
            }
            
        }));

        res.status(200).json(response.successResponse(`Product readiness for ${productName} updated`));
        
    } catch (error) {
        if (error.message.includes(`Cannot read properties of null (reading 'product_operating_model')`)) {
            res.status(404).json(response.errorResponse('Invalid name of product'));  

        } else {
            res.status(500).json(response.errorResponse('Internal Server error'));
        }
        
        next(error);
    }
}

module.exports = {
    addProductReadinesStatus
}