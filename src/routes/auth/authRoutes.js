const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authController/authController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware');

authRouter.post('/profit/porto/register',  authController.registerController);
authRouter.post('/profit/porto/login',  authController.loginController);
authRouter.get('/profit/porto/dashboard', authenticationMiddleware.authenticateUser,  authController.dashboardController);
authRouter.post('/profit/porto/refresh-tokens', authController.refreshTokensController);

module.exports = authRouter;