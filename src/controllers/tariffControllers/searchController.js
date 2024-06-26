const searchService = require('../../services/tariffServices/searchService');
const { successResponse, errorResponse } = require('../../helpers/web/webResponses');

async function searchProduct(req, res) {
    const { query } = req.query;

    try {
        const searchResults = await searchService.searchProduct(query);
        res.json(successResponse('Search results retrieved successfully', searchResults));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Internal server error'));
    }
}

async function searchCategory(req, res) {
    const { query } = req.query;

    try {
        const searchResults = await searchService.searchCategory(query);
        res.json(successResponse('Search results retrieved successfully', searchResults));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Internal server error'));
    }
}

async function searchComponent(req, res) {
    const { query } = req.query;

    try {
        const searchResults = await searchService.searchComponent(query);
        res.json(successResponse('Search results retrieved successfully', searchResults));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Internal server error'));
    }
}

module.exports = {
    searchProduct,
    searchCategory,
    searchComponent
};