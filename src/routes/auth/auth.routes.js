const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authController/authController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware');

authRouter.post('/profitplus/register',  authController.registerController);
authRouter.post('/profitplus/login',  authController.loginController);
authRouter.get('/profitplus/porto/dashboard', authenticationMiddleware.authenticateUser,  authController.dashboardController);
authRouter.post('/profitplus/refresh-tokens', authController.refreshTokensController);

module.exports = authRouter;