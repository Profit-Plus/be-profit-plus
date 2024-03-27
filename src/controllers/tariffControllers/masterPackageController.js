// controllers/tariffControllers/masterPackage/masterPackageController.js

const masterPackageService = require('../../services/tariffServices/masterPackageService');
const webResponses = require('../../helpers/web/webResponses');

async function createData(req, res) {
    const { event_module, nature, pic, description, source, unit, code, grade, category_id } = req.body;
    const category_id_parsed = parseInt(category_id)
    try {
        const createdData = await masterPackageService.createData(event_module, nature, pic, description, source, unit, code, grade, category_id_parsed);
        res.json( webResponses.successResponse('Data Created successfully', createdData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to create data') );
    }
}

async function getAllData(req, res) {
    try {
        const data = await masterPackageService.getAllData();
        res.json(webResponses.successResponse( 'Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch data') );
    }
}


async function getDataById(req, res) {
    const id = req.params.id;
    try {
        const data = await masterPackageService.getDataById(parseInt(id));
        if (!data) {
            return res.status(404).json( webResponses.errorResponse('data not found') );
        }
        res.json(webResponses.successResponse('Data fetched successfully', data));
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch data') );
    }
}

async function updateData(req, res) {
    const id = req.params.id;
    const { event_module, nature, pic, description, source, unit, code, grade, category_id } = req.body;
    try {
        const updatedData = await masterPackageService.updateData(parseInt(id), event_module, nature, pic, description, source, unit, code, grade, parseInt(category_id));
        res.json(webResponses.successResponse('Data updated successfully', updatedData));

    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to update data') );

    }
}

async function deleteData(req, res) {
    const id = req.params.id;
    try {
        await masterPackageService.deleteData(parseInt(id));
        res.json( webResponses.successResponse('Data deleted successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to delete data') );

    }
}

async function createComponent(req, res) {
    const { name, item, unit, specs, priceperunit, quantity, data_id } = req.body;
    try {
        const createdComponent = await masterPackageService.createComponent(name, item, unit, specs, priceperunit, quantity, parseInt(data_id));
        res.json( webResponses.successResponse('Component created successfully', createdComponent) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to create componenent') );

    }
}

async function getAllComponents(req, res) {
    try {
        const components = await masterPackageService.getAllComponents();
        res.json( webResponses.successResponse('Components fetched successfully', components) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch componenents') );
    }
}

async function getComponentById(req, res) {
    const id = req.params.id;
    try {
        const component = await masterPackageService.getComponentById(parseInt(id));
        if (!component) {
        return res.status(404).json( webResponses.errorResponse('Component not found') );
        }
        res.json( webResponses.successResponse('Component fetched successfully', component) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch componenent') );
    }
}

async function updateComponent(req, res) {
    const id = req.params.id;    
    const { name, item, unit, specs, priceperunit, quantity, data_id } = req.body;
    try {
        const updatedComponent = await masterPackageService.updateComponent(parseInt(id), name, item, unit, specs, priceperunit, quantity, parseInt(data_id));
        res.json( webResponses.successResponse('Component fetched successfully', updatedComponent) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to update componenent', updatedComponent) );
    }
}

async function deleteComponent(req, res) {
    const id = req.params.id;
    try {
        await masterPackageService.deleteComponent(parseInt(id));
        res.json( webResponses.successResponse('Data deleted successfully') );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to delete componenent') );
    }
}

module.exports = {
    createData,
    getAllData,
    getDataById,
    updateData,
    deleteData,
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent,
};