// controllers/createSheetController.js
const createSheetService = require('../../services/tariffServices/createSheetServices');
const Ajv = require('ajv');
const ajv = new Ajv();
const sheetValidator = require('../../validators/createSheet.validator');
const webResponses = require('../../helpers/web/webResponses');

async function createSheet(req, res) {
    const validate = ajv.compile(sheetValidator.createSheetSchema);
    const isValid = validate(req.body);

    if (!isValid) {
        return res.status(400).json(webResponses.errorResponse('Invalid data', validate.errors));
    }

    try {
        const newSheet = await createSheetService.createSheet(req.body);
        res.status(201).json(webResponses.successResponse('Sheet created successfully', { id: newSheet.id }));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create sheet'));
    }
}

async function getTypesBySheetId(req, res) {
    const { sheetId } = req.params;

    try {
        const types = await prisma.type.findMany({
            where: { sheetId: parseInt(sheetId) }
        });
        res.json(webResponses.successResponse('Types fetched successfully', types));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch types'));
    }
}

module.exports = {
    createSheet,
    getTypesBySheetId
};