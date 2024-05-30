const webResponses = require('../../helpers/web/webResponses');
const productService = require('../../services/tariffServices/productSErvice');


async function createProductSheet(req,res){
    const { sheet_id } = req.params;
    const { product_name } = req.body;

    const parsedSheetId = parseInt(sheet_id);
    try {
        const createdData = await productService.createProductSheet(parsedSheetId, product_name);
        res.status(200).json( webResponses.successResponse('Data Created successfully', createdData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to create data') );
    }
}

async function getProductSheet(req,res){
    const { sheet_id } = req.params;
    const parsedSheetId = parseInt(sheet_id);

    try {
        const productData = await productService.getProductSheet(parsedSheetId);
        res.status(200).json( webResponses.successResponse('Data fetched successfully', productData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch data') );
    }
}

async function updateProductSheet(req,res){
    const { sheet_id } = req.params;
    const { product_name } = req.body;

    const parsedSheetId = parseInt(sheet_id);
    try {
        const updatedData = await productService.updateProductSheet(parsedSheetId, product_name);
        res.status(200).json( webResponses.successResponse('Data updated successfully', updatedData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to update data') );
    }
}

module.exports = {
    createProductSheet,
    getProductSheet,
    updateProductSheet
}