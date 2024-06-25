const express = require('express');
const notificationRouter = express.Router();
const notificationController = require('../../controllers/projectMonitoring/notificationController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
notificationRouter.use('/notifications', authenticationMiddleware.authenticateUser);

// Define Routes
notificationRouter.post('/notifications', notificationController.createNotification);
notificationRouter.get('/notifications', notificationController.getAllNotifications);
notificationRouter.get('/notifications/:id', notificationController.getNotification);
notificationRouter.put('/notifications/:id', notificationController.updateNotification);
notificationRouter.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = notificationRouter;