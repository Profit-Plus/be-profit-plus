const express = require('express');
const commentRouter = express.Router();
const commentController = require('../../controllers/projectMonitoring/commentController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
commentRouter.use('/comments', authenticationMiddleware.authenticateUser);

// Define Routes
commentRouter.post('/comments', commentController.createComment);
commentRouter.get('/comments', commentController.getAllComments);
commentRouter.get('/comments/:id', commentController.getComment);
commentRouter.put('/comments/:id', commentController.updateComment);
commentRouter.delete('/comments/:id', commentController.deleteComment);

module.exports = commentRouter;