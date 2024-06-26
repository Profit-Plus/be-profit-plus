// controllers/tariffControllers/masterPackage/masterPackageController.js

const dashboardSSOService = require('../../services/tariffServices/dashboardSSOServices');
const webResponses = require('../../helpers/web/webResponses');

async function getSso(req, res) {
    try {
        const sso = await dashboardSSOService.getSso();
        if (!sso) {
            return res.status(404).json(webResponses.errorResponse('Sso not found'));
        }
        res.json(webResponses.successResponse('Sso fetched successfully', sso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch Sso'));
    }
}

async function getSsoById(req, res) {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json(webResponses.errorResponse('Id is required'));
    }
    try {
        const sso = await dashboardSSOService.getSsoById(parseInt(id));
        if (!sso) {
            return res.status(404).json(webResponses.errorResponse('Sso not found'));
        }
        res.json(webResponses.successResponse('Sso fetched successfully', sso));
    }
    catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch Sso'));
    }
}

async function createSso(req, res) {
    const { product_id } = req.body.product_id;
    if (!product_id) {
        return res.status(400).json(webResponses.errorResponse('Product id is required'));
    }
    try {
        const createdSso = await dashboardSSOService.createSso(product_id);
        if (!createdSso) {
            return res.status(404).json(webResponses.errorResponse('Sso not found'));
        }
        res.json(webResponses.successResponse('Sso created successfully', createdSso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create sso'));
    }
}

async function updateSso(req, res) {
    const { id, time_start, time_end, business_model, year, status, status_hold, data_collection, data_calculation, draft_tariff_validation, presentation_draft_tariff, request_draft_tariff, NDE_determination_tariff, work_time, archivement, description, sheet_id, product_id, requester_id, pic_id, owner_id } = req.body;
    if (!id) {
        return res.status(400).json(webResponses.errorResponse('Id is required'));
    }
    if (!time_start || !time_end || !business_model || !year || !status || !status_hold || !data_collection || !data_calculation || !draft_tariff_validation || !presentation_draft_tariff || !request_draft_tariff || !NDE_determination_tariff || !work_time || !archivement || !description || !sheet_id || !product_id || !requester_id || !pic_id || !owner_id) {
        return res.status(400).json(webResponses.errorResponse('All fields are required'));
    }
    try {
        const updatedSso = await dashboardSSOService.updateSso(id, time_start, time_end, business_model, year, status, status_hold, data_collection, data_calculation, draft_tariff_validation, presentation_draft_tariff, request_draft_tariff, NDE_determination_tariff, work_time, archivement, description, sheet_id, product_id, requester_id, pic_id, owner_id);
        if (!updatedSso) {
            return res.status(404).json(webResponses.errorResponse('Sso not found'));
        }
        res.json(webResponses.successResponse('Sso updated successfully', updatedSso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update sso'));
    }
}

module.exports = {
    getSso,
    createSso,
    updateSso,
    getSsoById
};
// Path: src/controllers/tariffControllers/masterPackageController.js