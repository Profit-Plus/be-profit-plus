const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authentication/auth.controller');
const miscController = require('../../controllers/authentication/misc/misc.controller');

authRouter.post('/register', authController.userRegistration);
authRouter.post('/login', authController.userLogin);
authRouter.post('/auth/generate-new-token', authController.generateNewToken);
authRouter.post('/register/add-new-level', miscController.addNewLevel);
authRouter.post('/register/add-new-unit', miscController.addNewUnit);
authRouter.post('/register/add-new-team', miscController.addNewTeam);

module.exports = authRouter;