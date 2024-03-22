const express = require('express');
const authRouter = express.Router();
const { registerController, loginController, testController } = require('../../controllers/authController/authController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware');

authRouter.post('/porto/register',  registerController.newUserRegistration);
authRouter.post('/porto/login',  loginController.existingUserLogin);
authRouter.get('/porto/dashboard', authenticationMiddleware.authenticateUser,  testController.dashboardController);

module.exports = authRouter;