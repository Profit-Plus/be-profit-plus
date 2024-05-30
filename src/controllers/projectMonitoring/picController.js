const picService = require('../../services/projectMonitoring/picService');
const webResponses = require('../../helpers/web/webResponses');
const picValidator = require('../../validators/PIC.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

async function createPIC(req, res) {
    try {
        const isCreatePICValid = picValidator.isCreatePICValid();

        if (!isCreatePICValid(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isCreatePICValid.errors[0])));
        }

        const { name, phone, role } = req.body;

        const isPhoneExist = await picService.findUniquePhone(phone);
        if (isPhoneExist) {
            return res.status(409).json(webResponses.errorResponse('Phone has been used!'));
        }

        const pic = await picService.createPIC({
            name: name,
            phone: phone,
            role: role
        });

        res.status(201).json(webResponses.successResponse('PIC created successfully!', pic));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getAllPICs(req, res) {
    try {
        const isGetAllPICValid = picValidator.isGetAllPICValid();

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
            role: req.query.role,
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (!isGetAllPICValid(params)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isGetAllPICValid.errors[0])));
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
        console.log(e);
        throw e;
    }
}

async function updatePIC(req, res) {
    try {
        const updatePicValidate = picValidator.isUpdatePICValid();

        if (!updatePicValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(updatePicValidate.errors[0])));
        }

        const picId = req.params.id;

        const pic = await picService.findPIC(picId);

        if (pic) {
            const { name, phone, role } = req.body;

            const isPhoneExist = await picService.findUniquePhone(phone);
            if (isPhoneExist) {
                return res.status(409).json(webResponses.errorResponse('Phone has been used!'));
            }

            const updatedPIC = await picService.updatePIC(picId, {
                name: name,
                phone: phone,
                role: role
            });

            res.status(200).json(webResponses.successResponse('PIC updated successfully!', updatedPIC));
        }
        else {
            res.status(404).json(webResponses.errorResponse('PIC not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deletePIC(req, res) {
    try {
        const picId = req.params.id;

        const pic = await picService.findPIC(picId);

        if (pic) {
            const deletedPIC = await picService.deletePIC(picId);

            res.status(200).json(webResponses.successResponse('PIC deleted successfully!', deletedPIC));
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