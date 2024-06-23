// controllers/tariffControllers/masterPackage/masterPackageController.js

const dashboardSSOService = require('../../services/tariffServices/dashboardSSOServices');
const webResponses = require('../../helpers/web/webResponses');

async function getSso(req, res) {
    try {
        const sso = await dashboardSSOService.getSso();
        res.json(webResponses.successResponse('Sso fetched successfully', sso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch Sso'));
    }
}

async function createSso(req, res) {
    const { product_id } = req.body.product_id;
    try {
        const createdSso = await dashboardSSOService.createSso(product_id);
        res.json(webResponses.successResponse('Sso created successfully', createdSso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create sso'));
    }
}

async function updateSso(req, res) {
    const { id, time_start, time_end, business_model, year, status, status_hold, data_collection, data_calculation, draft_tariff_validation, presentation_draft_tariff, request_draft_tariff, NDE_determination_tariff, work_time, archivement, description, sheet_id, product_id, requester_id, pic_id, owner_id } = req.body;
    try {
        const updatedSso = await dashboardSSOService.updateSso(id, time_start, time_end, business_model, year, status, status_hold, data_collection, data_calculation, draft_tariff_validation, presentation_draft_tariff, request_draft_tariff, NDE_determination_tariff, work_time, archivement, description, sheet_id, product_id, requester_id, pic_id, owner_id);
        res.json(webResponses.successResponse('Sso updated successfully', updatedSso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update sso'));
    }
}

module.exports = {
    getSso,
    createSso,
    updateSso
};
// Path: src/controllers/tariffControllers/masterPackageController.js