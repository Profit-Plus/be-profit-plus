const miscController = require('../../controllers/authentication/misc/misc.controller');
const authController = require('../../controllers/authentication/auth.controller');
const express = require('express');

const authRouter = express.Router();

authRouter.post('/profitplus/register', authController.userRegistration);
authRouter.post('/profitplus/login', authController.userLogin);
authRouter.post('/profitplus/auth/generate-new-token', authController.generateNewToken);
authRouter.post('/profitplus/register/add-new-level', miscController.addNewLevel);
authRouter.post('/profitplus/register/add-new-unit', miscController.addNewUnit);
authRouter.post('/profitplus/register/add-new-team', miscController.addNewTeam);

module.exports = authRouter;