const miscController = require('../../controllers/authentication/misc/misc.controller');
const authController = require('../../controllers/authentication/auth.controller');
const express = require('express');

const authRouter = express.Router();

authRouter.post('/register', authController.userRegistration);
authRouter.post('/login', authController.userLogin);
authRouter.post('/auth/generate-new-token', authController.generateNewToken);
authRouter.post('/register/add-new-level', miscController.addNewLevel);
authRouter.post('/register/add-new-unit', miscController.addNewUnit);
authRouter.post('/register/add-new-team', miscController.addNewTeam);
authRouter.get('/product/get-units', miscController.getAllUnits);

module.exports = authRouter;