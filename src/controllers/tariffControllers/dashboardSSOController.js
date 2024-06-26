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

async function getSheet(req, res) {
    try {
        const sheets = await dashboardSSOService.getSheet();
        res.json(webResponses.successResponse('Sheets fetched successfully', sheets));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch sheet'));
    }
}

async function getUnit(req, res) {
    try {
        const unit = await dashboardSSOService.getUnit();
        res.json(webResponses.successResponse('Unit fetched successfully', unit));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch unit'));
    }
}

async function getUser(req, res) {
    try {
        const users = await dashboardSSOService.getUser();
        res.json(webResponses.successResponse('Users fetched successfully', users));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch users'));
    }
}

async function createSso(req, res) {
    const { product_id } = req.body;
    console.log("product_id: " + product_id);
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
    const { 
        sheet_id,
        product_id,
        owner_id,
        pic_id,
        requester_id,
        NDE_determination_tariff,
        NDE_determination_tariff_boolean,
        achievement,
        business_model,
        data_calculation,
        data_calculation_boolean,
        data_collection,
        data_collection_boolean,
        description,
        draft_tariff_validation,
        draft_tariff_validation_boolean,
        evidence_tariff_link,
        evidence_tariff_text,
        presentation_draft_tariff,
        presentation_draft_tariff_boolean,
        progress, 
        request_draft_tariff,
        request_draft_tariff_boolean,    
        status,
        status_hold,
        time_end,
        time_start,
        work_time,
        work_time_num,
        year 
    } = req.body;
    const id = req.params.id;

    try {
        const updatedSso = await dashboardSSOService.updateSso(
            parseInt(id),
            sheet_id,
            product_id,
            owner_id,
            pic_id,
            requester_id,
            NDE_determination_tariff,
            NDE_determination_tariff_boolean,
            achievement,
            business_model,
            data_calculation,
            data_calculation_boolean,
            data_collection,
            data_collection_boolean,
            description,
            draft_tariff_validation,
            draft_tariff_validation_boolean,
            evidence_tariff_link,
            evidence_tariff_text,
            presentation_draft_tariff,
            presentation_draft_tariff_boolean,
            parseInt(progress), 
            request_draft_tariff,
            request_draft_tariff_boolean,    
            status,
            status_hold,
            time_end,
            time_start,
            work_time,
            work_time_num,
            year
        );
        res.json(webResponses.successResponse('Sso updated successfully', updatedSso));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update sso'));
    }
}

module.exports = {
    getSso,
    getSheet,
    getUnit,
    getUser,
    createSso,
    updateSso,
};
// Path: src/controllers/tariffControllers/masterPackageController.js