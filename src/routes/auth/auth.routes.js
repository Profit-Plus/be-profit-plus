const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authentication/authentication');
const authenticator = require('../../middlewares/authentication/authentication.middleware');

authRouter.post('/profitplus/register',  authController.registerController);
authRouter.post('/profitplus/login',  authController.loginController);
authRouter.get('/profitplus/porto/dashboard', authenticator.authenticator,  authController.dashboardController);
authRouter.post('/profitplus/refresh-tokens', authController.refreshTokensController);

module.exports = authRouter;