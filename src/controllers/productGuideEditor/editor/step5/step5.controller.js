const stepFiveService = require('../../../../services/productGuideEditor/editor/step5/step5.service');
const miscService = require('../../../../services/productGuideEditor/editor/misc/misc.service');
const response = require('../../../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

/**
 *  @function addProductTariffing to add the tariff schema of a product
 */
async function addProductTariffing(req, res, next) {
    try {
        /* Initialize request body */
        const productName = req.body.productName;
        const tariffingSchema = req.body.tariffingSchema;

        /* Initialize uuid and get the id of product based on its name */
        const productId = (await miscService.getProductIdByName(String(productName))).product_uuid;
        
        /* Store tariffing schema to database */
        await Promise.all(tariffingSchema.map(async (detail) => {
            const tariffUuid = uuidv4();
            await stepFiveService.addProductTariffing(tariffUuid, productId, detail);
        }));

        res.status(200).json(response.successResponse('Successfully add a new tariffing schema'));

    } catch (error) {
        res.status(500).json(response.errorResponse('Internal server error!'));
        next(error);
    }
}

module.exports = {
    addProductTariffing
}