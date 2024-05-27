const express = require('express');
const documentRouter = express.Router();
const documentController = require('../../controllers/projectMonitoring/documentController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
documentRouter.use('/document', authenticationMiddleware.authenticateUser);

// Define Routes
documentRouter.post('/documents', documentController.createDocument);
documentRouter.get('/documents', documentController.getAllDocuments);
documentRouter.get('/documents/:id', documentController.getDocument);
documentRouter.get('/documents/:id/download', documentController.downloadDocument);
documentRouter.put('/documents/:id', documentController.updateDocument);
documentRouter.delete('/documents/:id', documentController.deleteDocument);

module.exports = documentRouter;