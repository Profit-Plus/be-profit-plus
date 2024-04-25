const { Prisma } = require('@prisma/client');
const customerService = require('../../services/projectMonitoring/customerService');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');
const customerValidator = require('../../validators/Customer.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

const ajv = new Ajv();

async function createCustomer(req, res) {
    try {
        const createCustomerValidate = ajv.compile(customerValidator.createOrUpdateCustomer);

        if (!createCustomerValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse('Invalid input! ' + formatErrorMessage(createCustomerValidate.errors[0])));
        }

        const { name } = req.body;

        const customer = await customerService.createCustomer({            
            name: name,
            created_by: req.user_id,
            updated_by: req.user_id
        });

        res.status(200).json(webResponses.successResponse('Customer created successfully!', customer));
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return res.status(400).json(webResponses.errorResponse('There is a unique constraint violation on the constraint \'name\''));
            }
        }
        throw e;
    }
}

async function getAllCustomers(req, res) {
    try {        
        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
        }

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;

        const customer = await customerService.findAllCustomers(params);

        res.status(200).json(webResponses.successResponsePage('Customers data fetched successfully!', customer.page, customer.limit, customer.total, customer.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getCustomer(req, res) {
    try {
        const customerId = Number(req.params.id);

        const customer = await customerService.findCustomer(customerId);

        if (customer) {
            res.status(200).json(webResponses.successResponse('Customer data fetched successfully!', customer));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Customer not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function updateCustomer(req, res) {
    try {
        const updateCustomerValidate = ajv.compile(customerValidator.createOrUpdateCustomer);

        if (!updateCustomerValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse('Invalid input! ' + formatErrorMessage(updateCustomerValidate.errors[0])));
        }

        const { name } = req.body;

        const customerId = Number(req.params.id);

        const customer = await customerService.updateCustomer(customerId, {
            name: name,
            updated_by: req.user_id
        });

        if (customer) {
            res.status(200).json(webResponses.successResponse('Customer updated successfully!', customer));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Customer not found!'));
        }
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return res.status(400).json(webResponses.errorResponse('There is a unique constraint violation on the constraint \'name\''));
            }
        }
        throw e;
    }
}

async function deleteCustomer(req, res) {
    try {
        const customerId = Number(req.params.id);

        const customer = await customerService.findCustomer(customerId);

        if (customer) {
            await customerService.deleteCustomer(customerId);

            res.status(200).json(webResponses.successResponse('Customer deleted successfully!', customer));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Customer not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createCustomer,
    getCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
};