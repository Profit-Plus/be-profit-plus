const newSolutionService = require('../../services/solutionFormulation/newSolution.service');

const response = require('../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

async function addNewSolution(req, res, next) {
    try {
        /* Initialize request body and generate UUID */
        const solutionName = req.body.name;
        const id = uuidv4();

        /* Store a new solution to database */
        await newSolutionService.addNewSolution(id, String(solutionName));

        res.status(200).json(response.successResponse('Successfully add a new solution'));

    } catch (error) {
        res.status(500).json(response.errorResponse('Internal server error!'));
        next(error);
    }
}

module.exports = {
    addNewSolution
}