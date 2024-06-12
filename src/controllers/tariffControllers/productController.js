const webResponses = require('../../helpers/web/webResponses');
const productService = require('../../services/tariffServices/productSErvice');


async function createProductSheet(req,res){
    const { sheet_id } = req.params;

    const parsedSheetId = parseInt(sheet_id);
    try {
        const createdData = await productService.createProductSheet(parsedSheetId, req.body.product_id, req.body.taxonomy_id);
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

    const parsedSheetId = parseInt(sheet_id);
    try {
        const updatedData = await productService.updateProductSheet(parsedSheetId, req.body);
        res.status(200).json( webResponses.successResponse('Data updated successfully', updatedData) );
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to update data') );
    }
}

async function getTaxonomy(req, res){
    const getData = await productService.getTaxonomy();
    res.status(200).json( webResponses.successResponse('Data fetched successfully', getData) );
}

async function getSubTaxonomy(req, res){
    const { taxonomy_id } = req.params;

    const parsedTaxonomyId = parseInt(taxonomy_id);
    try{
        const getData = await productService.getSubTaxonomy(parsedTaxonomyId);
        res.status(200).json( webResponses.successResponse('Data fetched successfully', getData) );
    }catch (error){
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch data') );
    }
}

async function getUser(req, res){
    const getData = await productService.getUser();
    res.status(200).json( webResponses.successResponse('Data fetched successfully', getData) );
}

async function getUnit(req, res){
    const getData = await productService.getUnit();
    res.status(200).json( webResponses.successResponse('Data fetched successfully', getData) );
}


module.exports = {
    createProductSheet,
    getProductSheet,
    updateProductSheet,
    getTaxonomy,
    getSubTaxonomy,
    getUser,
    getUnit
}