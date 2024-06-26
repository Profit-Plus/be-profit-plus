const express = require('express');
const picRouter = express.Router();
const picController = require('../../controllers/projectMonitoring/picController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
picRouter.use('/pics', authenticationMiddleware.authenticateUser);

// Define Routes
picRouter.post('/pics', picController.createPIC);
picRouter.get('/pics', picController.getAllPICs);
picRouter.get('/pics/:id', picController.getPIC);
picRouter.put('/pics/:id', picController.updatePIC);
picRouter.delete('/pics/:id', picController.deletePIC);

module.exports = picRouter;