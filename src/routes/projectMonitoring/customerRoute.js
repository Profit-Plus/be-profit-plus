const express = require('express');
const customerRouter = express.Router();
const customerController = require('../../controllers/projectMonitoring/customerController');
const { authenticationMiddleware } = require('../../middlewares/authMiddlewares/authMiddleware');

// Use Auth Middleware
customerRouter.use('/customers', authenticationMiddleware.authenticateUser);

// Define Routes
customerRouter.post('/customers', customerController.createCustomer);
customerRouter.get('/customers', customerController.getAllCustomers);
customerRouter.get('/customers/:id', customerController.getCustomer);
customerRouter.put('/customers/:id', customerController.updateCustomer);
customerRouter.delete('/customers/:id', customerController.deleteCustomer);

module.exports = customerRouter;