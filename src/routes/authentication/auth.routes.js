const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authentication/auth.controller');

authRouter.post('/profitplus/register', authController.userRegistration);
authRouter.post('/profitplus/login', authController.userLogin);
authRouter.post('/profitplus/auth/generate-new-token', authController.generateNewToken);
authRouter.post('/profitplus/register/add-new-level', authController.addNewLevel);
authRouter.post('/profitplus/register/add-new-unit', authController.addNewUnit);
authRouter.post('/profitplus/register/add-new-team', authController.addNewTeam);

module.exports = authRouter;