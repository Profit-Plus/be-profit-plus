const solutionService = require('../../services/tariffServices/solutionTariffServices')
const webResponses = require('../../helpers/web/webResponses');

async function getSolutionGTOMTariff(req, res) {
    try {
        const params = parseInt(req.params.id);
        const products = await solutionService.getSolutionGTOMTariff(params);
        res.json(webResponses.successResponse('Products fetched successfully', products));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch products'));
    }
}

async function getSolutionPortofolioTariff(req, res) {
    try {
        const params = parseInt(req.params.id);
        const products = await solutionService.getSolutionPortofolioTariff(params);
        res.json(webResponses.successResponse('Products fetched successfully', products));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch products'));
    }
}

module.exports = {
    getSolutionGTOMTariff,
    getSolutionPortofolioTariff
};