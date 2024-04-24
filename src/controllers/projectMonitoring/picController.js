const { Prisma } = require('@prisma/client');
const picService = require('../../services/projectMonitoring/picService');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const Ajv = require('ajv');
const picValidator = require('../../validators/PIC.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError')

const ajv = new Ajv();

async function createPIC(req, res) {
    try {
        const createPicValidate = ajv.compile(picValidator.createPIC);

        if (!createPicValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse('Invalid input! ' + formatErrorMessage(createPicValidate.errors[0])));
        }

        const { name, phone, role } = req.body;

        const id = uuidv4();

        const pic = await picService.createPIC({
            id: id,
            name: name,
            phone: phone,
            role: role,
            created_by: "",
            updated_by: ""
        });

        res.status(200).json(webResponses.successResponse('PIC created successfully!', pic));
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return res.status(400).json(webResponses.errorResponse('There is a unique constraint violation on the constraint \'phone\''));
            }
        }
        throw e;
    }
}

async function getAllPICs(req, res) {
    try {
        const getAllPICsValidate = ajv.compile(picValidator.getAllPICs);

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
            role: req.query.role
        }

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (params.role && !getAllPICsValidate(params)) {
            return res.status(400).json(webResponses.errorResponse('Invalid input! ' + formatErrorMessage(getAllPICsValidate.errors[0])));
        }        

        const pic = await picService.findAllPICs(params);

        res.status(200).json(webResponses.successResponsePage('PICs data fetched successfully!', pic.page, pic.limit, pic.total, pic.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getPIC(req, res) {
    try {
        const picId = req.params.id;

        const pic = await picService.findPIC(picId);

        if (pic) {
            res.status(200).json(webResponses.successResponse('PIC data fetched successfully!', pic));
        }
        else {
            res.status(404).json(webResponses.errorResponse('PIC not found!'));
        }
    } catch (e) {
        console.log(e)
        throw e;
    }
}

async function updatePIC(req, res) {
    try {
        const updatePicValidate = ajv.compile(picValidator.updatePIC);

        if (!updatePicValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse('Invalid input! ' + formatErrorMessage(updatePicValidate.errors[0])));
        }

        const { name, phone, role } = req.body;

        const picId = req.params.id;

        const pic = await picService.updatePIC(picId, {
            name: name,
            phone: phone,
            role: role
        });

        if (pic) {
            res.status(200).json(webResponses.successResponse('PIC updated successfully!', pic));
        }
        else {
            res.status(404).json(webResponses.errorResponse('PIC not found!'));
        }
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return res.status(400).json(webResponses.errorResponse('There is a unique constraint violation on the constraint \'phone\''));
            }
        }
        throw e;
    }
}

async function deletePIC(req, res) {
    try {
        const picId = req.params.id;

        const pic = await picService.findPIC(picId);

        if (pic) {
            await picService.deletePIC(picId);

            res.status(200).json(webResponses.successResponse('PIC deleted successfully!', pic));
        }
        else {
            res.status(404).json(webResponses.errorResponse('PIC not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createPIC,
    getPIC,
    getAllPICs,
    updatePIC,
    deletePIC
}