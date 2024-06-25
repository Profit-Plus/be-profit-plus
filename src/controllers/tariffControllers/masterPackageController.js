// File path: /controllers/masterController.js

const masterService = require('../../services/tariffServices/masterPackageService');
const Ajv = require('ajv');
const webResponses = require('../../helpers/web/webResponses');
const MasterValidator = require("../../validators/MasterPackage.validator");

const ajv = new Ajv();

async function getAllData(req, res) {
    try {
        const data = await masterService.getAllData();
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function getDataById(req, res) {
    const { data_id } = req.params;
    try {
        const data = await masterService.getDataById(parseInt(data_id));
        if (!data) {
            res.status(404).json(webResponses.errorResponse('Data not found'));
        } else {
            res.json(webResponses.successResponse('Detail fetched successfully', data));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
    }
}

async function createData(req, res) {
    const data = req.body;
    const validate = ajv.compile(MasterValidator.createData);
    
    if (!validate(data)) {
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + validate.errors[0].message));
        return;
    }

    try {
        const newData = await masterService.createData(data);
        res.json(webResponses.successResponse('Data created successfully', newData));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create data'));
    }
}

async function updateDataById(req, res) {
    const { data_id } = req.params;
    const updatedData = req.body;
    const validate = ajv.compile(MasterValidator.updateData);
    
    if (!validate(updatedData)) {
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + validate.errors[0].message));
        return;
    }

    try {
        const data = await masterService.updateDataById(parseInt(data_id), updatedData);
        res.json(webResponses.successResponse('Data updated successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update data'));
    }
}

async function deleteDataById(req, res) {
    const { data_id } = req.params;
    try {
        const data = await masterService.deleteDataById(parseInt(data_id));
        res.json(webResponses.successResponse('Data deleted successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to delete data'));
    }
}

async function deleteComponentById(req, res) {
    const { component_id } = req.params;
    try {
        const componentRelation = await masterService.deleteComponentById(parseInt(component_id));
        res.json(webResponses.successResponse('Component relation deleted successfully', componentRelation));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to delete component relation'));
    }
}

async function addRelation(req, res) {
    const { data_id, component_id } = req.body;
    try {
        const newRelation = await masterService.addRelation(parseInt(data_id), parseInt(component_id));
        res.json(webResponses.successResponse('Relation added successfully', newRelation));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to add relation'));
    }
}

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateDataById,
    deleteDataById,
    deleteComponentById,
    addRelation
};


// // File path: /controllers/masterController.js

// const masterService = require('../../services/tariffServices/masterPackageService');
// const Ajv = require('ajv');
// const webResponses = require('../../helpers/web/webResponses');
// const MasterValidator = require("../../validators/MasterPackage.validator");

// const ajv = new Ajv();

// async function getAllData(req, res) {
//     try {
//         const data = await masterService.getAllData();
//         res.json(webResponses.successResponse('Data fetched successfully', data));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
//     }
// }

// async function getDataById(req, res) {
//     const { data_id } = req.params;
//     try {
//         const data = await masterService.getDataById(parseInt(data_id));
//         if (!data) {
//             res.status(404).json(webResponses.errorResponse('Data not found'));
//         } else {
//             res.json(webResponses.successResponse('Detail fetched successfully', data));
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to fetch data'));
//     }
// }

// async function createDataById(req, res) {
//     const data = req.body;
//     const validate = ajv.compile(MasterValidator.createData);
    
//     if (!validate(data)) {
//         res.status(400).json(webResponses.errorResponse('Invalid input! ' + validate.errors[0].message));
//         return;
//     }

//     try {
//         const newData = await masterService.createDataById(data);
//         res.json(webResponses.successResponse('Data created successfully', newData));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to create data'));
//     }
// }

// async function updateDataById(req, res) {
//     const { data_id } = req.params;
//     const updatedData = req.body;
//     const validate = ajv.compile(MasterValidator.updateData);
    
//     if (!validate(updatedData)) {
//         res.status(400).json(webResponses.errorResponse('Invalid input! ' + validate.errors[0].message));
//         return;
//     }

//     try {
//         const data = await masterService.updateDataById(parseInt(data_id), updatedData);
//         res.json(webResponses.successResponse('Data updated successfully', data));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to update data'));
//     }
// }

// async function deleteDataById(req, res) {
//     const { data_id } = req.params;
//     try {
//         const data = await masterService.deleteDataById(parseInt(data_id));
//         res.json(webResponses.successResponse('Data deleted successfully', data));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to delete data'));
//     }
// }

// async function deleteComponentById(req, res) {
//     const { component_id } = req.params;
//     try {
//         const componentRelation = await masterService.deleteComponentById(parseInt(component_id));
//         res.json(webResponses.successResponse('Component relation deleted successfully', componentRelation));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to delete component relation'));
//     }
// }

// module.exports = {
//     getAllData,
//     getDataById,
//     createDataById,
//     updateDataById,
//     deleteDataById,
//     deleteComponentById
// };
