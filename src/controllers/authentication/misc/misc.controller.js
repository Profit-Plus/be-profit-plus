const userService = require('../../../services/authentication/user.service');
const response = require('../../../helpers/web/webResponses');

const { v4: uuidv4 } = require('uuid');

/**
 * @function addNewLevel to add a new name of level
 */
async function addNewLevel(req, res, next) {
    try {
        /* Initialize the request body of the API and uuid */
        const level = req.body;
        const id = uuidv4();

        /* Add a new level name */
        await userService.addNewLevel(id, level);

        /* Send responses */
        res.status(200).json(response.successResponse('New level added!', level));
    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

/**
 * @function addNewUnit to add a new name of unit
 */
async function addNewUnit(req, res, next) {
    try {
        /* Initialize the request body of the API and uuid */
        const unit = req.body;
        const id = uuidv4();

        /* Add a new level name */
        await userService.addNewUnit(id, unit);

        /* Send responses */
        res.status(200).json(response.successResponse('New unit added!', unit));
    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

/**
 * @function addNewLevel to add a new name of level
 */
async function addNewTeam(req, res, next) {
    try {
        /* Initialize the request body of the API and uuid */
        const team = req.body;
        const id = uuidv4();

        /* Add a new level name */
        await userService.addNewTeam(id, team);

        /* Send responses */
        res.status(200).json(response.successResponse('New team added!', team));
    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

module.exports = {
    addNewLevel,
    addNewUnit,
    addNewTeam
}