const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/authController/authController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware');

authRouter.post('/porto/register',  authController.registerController);
authRouter.post('/porto/login',  authController.loginController);
authRouter.get('/porto/dashboard', authenticationMiddleware.authenticateUser,  authController.dashboardController);
authRouter.post('/porto/refresh-tokens', authController.refreshTokensController);

module.exports = authRouter;