const picService = require('../../services/projectMonitoring/pic.service');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');

async function createPicController(req, res, next) {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
            throw new Error('There are several fields empty!');
        }

        const id = uuidv4();

        const pic = await picService.createPic({
            id: id,
            name: name,
            phone: phone,
            created_by: "",
            updated_by: ""
        });

        res.status(200).json(webResponses.successResponse('PIC created successfully!', pic));
    } catch (error) {
        console.log(error)
    }
}

async function getAllPicsController(req, res, next) {
    const pic = await picService.findAllPics();

    if (pic) {
        res.status(200).json(webResponses.successResponse('PICs data fetched successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function getPicController(req, res, next) {
    const picId = req.params.id;

    const pic = await picService.findPic(picId);

    if (pic) {
        res.status(200).json(webResponses.successResponse('PIC data fetched successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function updatePicController(req, res, next) {
    const { name, phone } = req.body;
    const picId = req.params.id;

    if (!name || !phone) {
        res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
        throw new Error('There are several fields empty!');
    }

    const pic = await picService.updatePic(picId, {
        name: name,
        phone: phone
    });

    if (pic) {
        res.status(200).json(webResponses.successResponse('PIC updated successfully!', pic));
    }
    else {
        res.status(404).json(webResponses.successResponse('PIC not found!'));
    }
}

async function deletePicController(req, res, next) {
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
    createPicController,
    getPicController,
    getAllPicsController,
    updatePicController,
    deletePicController
}