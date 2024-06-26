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

projectRouter.post('/projects/:id/drop', projectController.dropProject);
projectRouter.post('/projects/:id/approval/request', projectController.sendApprovalRequest);
projectRouter.post('/projects/:id/approval/approve', projectController.approveApprovalRequest);
projectRouter.post('/projects/:id/approval/decline', projectController.declineApprovalRequest);

module.exports = projectRouter;