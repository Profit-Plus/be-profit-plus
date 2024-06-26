const webResponses = require('../../helpers/web/webResponses');
const offeringService = require('../../services/tariffServices/offeringService');
const Ajv = require('ajv');
const OfferValidator = require('../../validators/Offer.validator');

const ajv = new Ajv();

async function createOffering(req, res) {
    const { sheet_id } = req.params;
    const { offer_name } = req.body;

    const parsedSheetId = parseInt(sheet_id);
    try {
        const createdData = await offeringService.createOffer(parsedSheetId, offer_name);
        res.json( webResponses.successResponse('Data Created successfully', createdData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to create data') );
    }
}

async function getOffering(req, res) {
    const { sheet_id } = req.params;
    const parsedSheetId = parseInt(sheet_id);

    try {
        const offeringData = await offeringService.getOffering(parsedSheetId);
        res.json( webResponses.successResponse('Data fetched successfully', offeringData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch data') );
    }
}

async function updateOffering(req, res){
    const { offering_id } = req.params;

    const parsedOfferingId = parseInt(offering_id);
    try{
        const updateData = ajv.compile(OfferValidator.updateDataOffer)
        if (!updateData(req.body)) {
            res.status(400).json(webResponses.errorResponse('Invalid input! '+updateData.errors[0].message));
            throw new Error('There are several fields empty!');
        }
        const offer_query = req.body;

        const updatedData = await offeringService.updateOffer(parsedOfferingId, offer_query.offer_name, offer_query.unit, offer_query.user_target);
        res.json(webResponses.successResponse('Data updated successfully', updatedData));   
    } catch (error){
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update data'));
    }
}

async function updateStatusOffering (req, res){
    const { offering_id, package_id } = req.params;
    const { package_status } = req.body;
    console.log(package_status)

    const parsedOfferingId = parseInt(offering_id);
    const parsedPackageId = parseInt(package_id);
    try{
        const updatedData = await offeringService.updateStatusOffering(parsedOfferingId, parsedPackageId, package_status);
        res.json(webResponses.successResponse('Data updated successfully', updatedData));
    } catch (error){
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update data'));
    }
}

async function deleteOffering (req, res){
    const { query_offer_id } = req.body;
    console.log(query_offer_id)

    try{
        const deletedData = await offeringService.deleteOffering(parseInt(query_offer_id));
        res.json(webResponses.successResponse('Data updated successfully', deletedData));
    } catch (error){
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update data'));
    }
}

module.exports = {
    createOffering,
    getOffering,
    updateOffering,
    updateStatusOffering,
    deleteOffering
};