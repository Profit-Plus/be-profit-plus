const express = require('express');
const projectRouter = express.Router();
const projectController = require('../../controllers/projectMonitoring/projectController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
projectRouter.use('/projects', authenticationMiddleware.authenticateUser);

// Define Routes
projectRouter.post('/projects', projectController.createProject);
projectRouter.get('/projects', projectController.getAllProjects);
projectRouter.get('/projects/:id', projectController.getProject);
projectRouter.put('/projects/:id', projectController.updateProject);
projectRouter.delete('/projects/:id', projectController.deleteProject);

module.exports = projectRouter;