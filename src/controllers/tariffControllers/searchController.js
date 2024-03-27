const searchService = require('../../services/tariffServices/searchService');
const { successResponse, errorResponse } = require('../../helpers/web/webResponses');

module.exports = {
    search: async (req, res) => {
        const { query } = req.query;

        try {
            const searchResults = await searchService.search(query);
            res.json(successResponse('Search results retrieved successfully', searchResults));
        } catch (error) {
            console.error(error);
            res.status(500).json(errorResponse('Internal server error'));
        }
    }
};
