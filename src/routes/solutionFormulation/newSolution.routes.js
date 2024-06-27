const newSolutionController = require('../../controllers/solutionFormulation/newSolution.controller');
const express = require('express');

const newSolutionRouter = express.Router();

newSolutionRouter.post('/product/add-new-solution', newSolutionController.addNewSolution);

module.exports = newSolutionRouter;