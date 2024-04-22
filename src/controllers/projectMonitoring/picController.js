const picService = require('../../services/projectMonitoring/pic.service');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const Ajv = require('ajv');
const picValidator = require('../../validators/PIC.validator');

const ajv = new Ajv();

async function createPIC(req, res) {
    try {
        const createPicValidate = ajv.compile(picValidator.createPIC);

        if (!createPicValidate(req.body)) {     
            let prop = createPicValidate.errors[0].instancePath;
            if (prop) prop = '\'' + createPicValidate.errors[0].instancePath.replace('/', '') + '\' ';
            const errMessage = prop + createPicValidate.errors[0].message;

            res.status(400).json(webResponses.errorResponse('Invalid input! '+ errMessage));
            throw new Error('There are several fields empty!');
        }        

        const {name, phone, role} = req.body;

        const id = uuidv4();

        const pic = await picService.createPic({
            id: id,
            name: name,
            phone: phone,
            role: role,
            created_by: "",
            updated_by: ""
        });

        res.status(200).json(webResponses.successResponse('PIC created successfully!', pic));
    } catch (error) {
        console.log(error)
    }
}

async function getAllPICs(req, res) {
    const pic = await picService.findAllPics();

    if (pic) {
        res.status(200).json(webResponses.successResponse('PICs data fetched successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function getPIC(req, res) {
    const picId = req.params.id;

    const pic = await picService.findPic(picId);

    if (pic) {
        res.status(200).json(webResponses.successResponse('PIC data fetched successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function updatePIC(req, res) {
    const updatePicValidate = ajv.compile(picValidator.updatePIC);

    if (!updatePicValidate(req.body)) {     
        let prop = updatePicValidate.errors[0].instancePath;
        if (prop) prop = '\'' + updatePicValidate.errors[0].instancePath.replace('/', '') + '\' ';
        const errMessage = prop + updatePicValidate.errors[0].message;

        res.status(400).json(webResponses.errorResponse('Invalid input! '+ errMessage));
        throw new Error('There are several fields empty!');
    }        
    
    const { name, phone, role } = req.body;
    
    const picId = req.params.id;

    const pic = await picService.updatePic(picId, {
        name: name,
        phone: phone,
        role: role
    });

    if (pic) {
        res.status(200).json(webResponses.successResponse('PIC updated successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function deletePIC(req, res) {
    const picId = req.params.id;

    const pic = await picService.findPic(picId);    

    if (pic) {
        await picService.deletePic(picId);

        res.status(200).json(webResponses.successResponse('PIC deleted successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

module.exports = {
    createPIC,
    getPIC,
    getAllPICs,
    updatePIC,
    deletePIC
}