const stepOneService = require('../../../services/productGuideEditor/step1.service');
const response = require('../../../helpers/web/webResponses');

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
        await stepOneService.addNewTaxonomy(id, taxonomy);

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

module.exports = {
    addNewTaxonomy
}