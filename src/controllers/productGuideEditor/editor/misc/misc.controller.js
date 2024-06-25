const miscService = require('../../../../services/productGuideEditor/editor/misc/misc.service');
const response = require('../../../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

/**
 *  @function addNewTaxonomy to add a new name of taxonomy  
 */
async function addNewTaxonomy(req, res, next) {
    try {
        /* Initialize request body and uuid */
        const taxonomy = req.body;
        const id = uuidv4();

        /* Store id and taxonomy to database */
        await miscService.addNewTaxonomy(id, taxonomy);

        /* Send responses */
        res.status(200).json(response.successResponse('New taxonomy added!', taxonomy));

    } catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json(response.errorResponse('Duplicate name of product!'));
        } else {
            res.status(500).json(response.errorResponse('Internal Server error!'));
        }

        next(error);
    }
}

async function getAllTaxonomy(req, res, next) {
    try {
        /* Get all taxonomy from database */
        const taxonomy = await miscService.getAllTaxonomy();
        res.status(200).json(response.successResponse('Fetching all taxonomy', taxonomy));
    } catch (error) {
        res.status(500).json(response.errorResponse('Failed to fetch datas'));
        next(error);
    }
}

module.exports = {
    addNewTaxonomy,
    getAllTaxonomy,
}