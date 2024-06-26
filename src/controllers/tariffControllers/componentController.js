// controllers/tariffControllers/componentController.js
const componentService = require('../../services/tariffServices/componentServices');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');
const { createComponentSchema, updateComponentSchema } = require('../../validators/Component.validator');

const ajv = new Ajv();

async function getAllComponents(req, res) {
    try {
        const components = await componentService.getAllComponents();
        res.json(webResponses.successResponse('Components fetched successfully', components));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to fetch components'));
    }
}

async function deleteComponentById(req, res) {
    const { id } = req.params;

    try {
        await componentService.deleteComponentById(parseInt(id));
        res.json(webResponses.successResponse('Component deleted successfully'));
    } catch (error) {
        console.error(error);
        if (error.code === 'P2003') {
            res.status(400).json(webResponses.errorResponse('Failed to delete component: Component is still referenced in another table.'));
        } else {
            res.status(500).json(webResponses.errorResponse('Failed to delete component'));
        }
    }
}

async function createComponent(req, res) {
    const newComponentData = req.body;

    const validate = ajv.compile(createComponentSchema);
    const valid = validate(newComponentData);

    if (!valid) {
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + ajv.errorsText(validate.errors)));
        return;
    }

    try {
        const createdComponent = await componentService.createComponent(newComponentData);
        res.json(webResponses.successResponse('Component created successfully', createdComponent));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to create component'));
    }
}

async function updateComponentById(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const validate = ajv.compile(updateComponentSchema);
    const valid = validate(updateData);

    if (!valid) {
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + ajv.errorsText(validate.errors)));
        return;
    }

    try {
        const updatedComponent = await componentService.updateComponentById(parseInt(id), updateData);
        res.json(webResponses.successResponse('Component updated successfully', updatedComponent));
    } catch (error) {
        console.error(error);
        res.status(500).json(webResponses.errorResponse('Failed to update component'));
    }
}

module.exports = {
    getAllComponents,
    deleteComponentById,
    createComponent,
    updateComponentById,
};

// // controllers/tariffControllers/componentController.js
// const componentService = require('../../services/tariffServices/componentServices');
// const webResponses = require('../../helpers/web/webResponses');
// const Ajv = require('ajv');
// const { createComponentSchema, updateComponentSchema } = require('../../validators/Component.validator');

// const ajv = new Ajv();

// async function getAllComponents(req, res) {
//     try {
//         const components = await componentService.getAllComponents();
//         res.json(webResponses.successResponse('Components fetched successfully', components));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to fetch components'));
//     }
// }

// async function deleteComponentById(req, res) {
//     const { id } = req.params;

//     try {
//         await componentService.deleteComponentById(parseInt(id));
//         res.json(webResponses.successResponse('Component deleted successfully'));
//     } catch (error) {
//         console.error(error);
//         if (error.code === 'P2003') {
//             res.status(400).json(webResponses.errorResponse('Failed to delete component: Component is still referenced in another table.'));
//         } else {
//             res.status(500).json(webResponses.errorResponse('Failed to delete component'));
//         }
//     }
// }

// async function createComponent(req, res) {
//     const newComponentData = req.body;

//     const validate = ajv.compile(createComponentSchema);
//     const valid = validate(newComponentData);

//     if (!valid) {
//         res.status(400).json(webResponses.errorResponse('Invalid input! ' + ajv.errorsText(validate.errors)));
//         return;
//     }

//     try {
//         const createdComponent = await componentService.createComponent(newComponentData);
//         res.json(webResponses.successResponse('Component created successfully', createdComponent));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to create component'));
//     }
// }

// async function updateComponentById(req, res) {
//     const { id } = req.params;
//     const updateData = req.body;

//     const validate = ajv.compile(updateComponentSchema);
//     const valid = validate(updateData);

//     if (!valid) {
//         res.status(400).json(webResponses.errorResponse('Invalid input! ' + ajv.errorsText(validate.errors)));
//         return;
//     }

//     try {
//         const updatedComponent = await componentService.updateComponentById(parseInt(id), updateData);
//         res.json(webResponses.successResponse('Component updated successfully', updatedComponent));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(webResponses.errorResponse('Failed to update component'));
//     }
// }

// module.exports = {
//     getAllComponents,
//     deleteComponentById,
//     createComponent,
//     updateComponentById,
// };
