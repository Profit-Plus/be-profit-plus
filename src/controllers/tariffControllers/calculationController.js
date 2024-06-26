// calculationController.js
const webResponses = require('../../helpers/web/webResponses');
const calculationService = require('../../services/tariffServices/calculationServices');
const Ajv = require('ajv');
const { updateDataCalculation } = require('../../validators/Calculation.validator');

const ajv = new Ajv();

async function getCalculation(req, res) {
    const { sheet_id } = req.params;
    const parsedSheetId = parseInt(sheet_id);

    try {
        const packages = await calculationService.getCalculation(parsedSheetId);
        const response = {
            meta: {
                success: true,
                message: 'Detail fetched successfully',
            },
            results: packages,
        };
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getCalculationById(req, res) {
    const { package_id } = req.params;
    const parsedId = parseInt(package_id);

    try {
        const packageData = await calculationService.getCalculationById(parsedId);
        const response = {
            meta: {
                success: true,
                message: 'Detail fetched successfully',
            },
            result: packageData,
        };
        res.json(response);
    } catch (error) {
        console.error(error);
        if (error.message === 'Package not found') {
            res.status(404).json(webResponses.errorResponse('Package not found'));
        } else {
            res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
        }
    }
}

async function putCalculation(req, res) {
    const { package_id } = req.params;
    const parsedPackageId = parseInt(package_id);
    const updateData = req.body;

    console.log('Received payload:', updateData);

    const validate = ajv.compile(updateDataCalculation);
    const valid = validate(updateData);

    if (!valid) {
        console.log('Validation errors:', validate.errors);
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + ajv.errorsText(validate.errors)));
        return;
    }

    try {
        const updatedData = await calculationService.putCalculation(parsedPackageId, updateData);
        res.json(webResponses.successResponse('Data updated successfully', updatedData));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update data'));
    }
}

module.exports = {
    getCalculation,
    getCalculationById,
    putCalculation,
};