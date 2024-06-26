const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../../controllers/projectMonitoring/dashboardController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
dashboardRouter.use('/pics', authenticationMiddleware.authenticateUser);

// Define Routes
dashboardRouter.get('/dashboard/project-summary', dashboardController.getProjectSummary);
dashboardRouter.get('/dashboard/project-progress', dashboardController.getProjectProgress);
dashboardRouter.get('/dashboard/project-partnership', dashboardController.getProjectPartnership);

module.exports = dashboardRouter;