const express = require('express');
const customerRouter = express.Router();
const customerController = require('../../controllers/projectMonitoring/customerController');
const authenticationMiddleware = require('../../middlewares/authentication/auth.middleware');

// Use Auth Middleware
customerRouter.use('/pics', authenticationMiddleware.authenticateUser);

// Define Routes
customerRouter.post('/customers', customerController.createCustomer);
customerRouter.get('/customers', customerController.getAllCustomers);
customerRouter.get('/customers/:id', customerController.getCustomer);
customerRouter.put('/customers/:id', customerController.updateCustomer);
customerRouter.delete('/customers/:id', customerController.deleteCustomer);

module.exports = customerRouter;