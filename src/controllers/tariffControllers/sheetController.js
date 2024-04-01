const sheetService = require('../../services/tariffServices/sheetService');
const webResponses = require('../../helpers/web/webResponses');

async function getSheet(req, res) {
    try {
        const sheet = await sheetService.getSheet();
        res.json(webResponses.successResponse('Sheet fetched successfully', sheet));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch sheet'));
    }
}

async function getSheetById(req, res) {
    const id = req.params.id;
    try {
        const sheet = await sheetService.getSheetById(parseInt(id));
        if (!sheet) {
            return res.status(404).json(webResponses.errorResponse('Sheet not found'));
        }
        res.json(webResponses.successResponse('Sheet fetched successfully', sheet));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch sheet'));
    }
}

async function createSheet(req, res) {
    const { name } = req.body;
    try {
        const createdSheet = await sheetService.createSheet(name);
        res.json(webResponses.successResponse('Sheet created successfully', createdSheet));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create sheet'));
    }
}

async function updateSheet(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    try {
        const updatedSheet = await sheetService.updateSheet(parseInt(id), name);
        res.json(webResponses.successResponse('Sheet updated successfully', updatedSheet));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update sheet'));
    }
}

async function deleteSheet(req, res) {
    const id = req.params.id;
    try {
        await sheetService.deleteSheet(parseInt(id));
        res.json(webResponses.successResponse('Sheet deleted successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to delete sheet'));
    }
}

module.exports = {
    getSheet,
    getSheetById,
    createSheet,
    updateSheet,
    deleteSheet
}