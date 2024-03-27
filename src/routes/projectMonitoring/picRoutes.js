const express = require('express');
const picRouter = express.Router();
const controller = require('../../controllers/projectMonitoring/picController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware')

// Use Auth Middleware
picRouter.use('/pics', authenticationMiddleware.authenticateUser);

// Define Routes
picRouter.post('/pics', controller.createPicController);
picRouter.get('/pics', controller.getAllPicsController);
picRouter.get('/pics/:id', controller.getPicController);
picRouter.put('/pics/:id', controller.updatePicController);
picRouter.delete('/pics/:id', controller.deletePicController);

module.exports = picRouter;