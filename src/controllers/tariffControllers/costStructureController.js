const { Prisma } = require('@prisma/client');
const costStructureService = require('../../services/tariffServices/costStructureService');
const webResponses = require('../../helpers/web/webResponses');
const Ajv = require('ajv');
const costStructureValidator = require('../../validators/CostStructure.validator');

const ajv = new Ajv();


async function getCostStructure(req, res) {
    const id = req.params.sheetsId;
    try {
        const detail = await costStructureService.getCostStructure(parseInt(id));
        if (!detail) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(webResponses.successResponse( 'Cost Structure fetched successfully', detail));
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch Cost Structure') );
    }
}


async function getDetailList(req, res) {  
    try {
        const detailList = await costStructureService.getDetailList();
        if (!detailList) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(webResponses.successResponse( 'Detail list fetched successfully', detailList));
    } catch (error) {
        console.error(error);
        res.status(500).json( webResponses.errorResponse('Failed to fetch detail list') );
    }
}
  

async function upsertCategory(req, res, next) {
  try {
    const newCategoryValidator = ajv.compile(costStructureValidator.upsertCategory)
    if (!newCategoryValidator(req.body)) {
        res.status(400).json(webResponses.errorResponse('Invalid input! ' + newCategoryValidator.errors[0].message));
        throw new Error('There are several fields empty!');
    }
    const sheetId = req.params.sheetId;
    const newCategory = req.body;
    const createCategory = await costStructureService.upsertCategory(sheetId, newCategory);
    res.json(webResponses.successResponse( 'Category created successfully', createCategory));
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError){
      res.status(409).json(webResponses.errorResponse("Unavailable name!"));
    } 
    else if (error instanceof Prisma.PrismaClientRustPanicError) {
      res.status(500).json(webResponses.errorResponse("Internal server error!"));
    }
    next(error);
  }
}

// async function createNewCategory(req, res, next) {
//     try {
//       const newCategoryValidator = ajv.compile(costStructureValidator.createNewCategory)
//       if (!newCategoryValidator(req.body)) {
//           res.status(400).json(webResponses.errorResponse('Invalid input! ' + newCategoryValidator.errors[0].message));
//           throw new Error('There are several fields empty!');
//       }
//       const newCategory = req.body;
//       const createCategory = await costStructureService.createCategory(newCategory);
//       res.json(webResponses.successResponse( 'Category created successfully', createCategory));
//     }
//     catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError){
//         res.status(409).json(webResponses.errorResponse("Unavailable name!"));
//       } 
//       else if (error instanceof Prisma.PrismaClientRustPanicError) {
//         res.status(500).json(webResponses.errorResponse("Internal server error!"));
//       }
//       next(error);
//     }
//   }
  
// async function updateCategory(req, res, next) {
//     try {
//       const updateCategoryValidator = ajv.compile(costStructureValidator.updateCategory)
//       if (!updateCategoryValidator(req.body)) {
//           res.status(400).json(webResponses.errorResponse('Invalid input! ' + updateCategoryValidator.errors[0].message));
//           throw new Error('There are several fields empty!');
//       }

//       const newCategory = req.body;
//       const createCategory = await costStructureService.updateCategory(newCategory);
//       res.json(webResponses.successResponse( 'Category updated successfully', createCategory));
//     }
//     catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError){
//       res.status(409).json(webResponses.errorResponse("Unavailable name!"));
//       } 
//       else if (error instanceof Prisma.PrismaClientRustPanicError) {
//       res.status(500).json(webResponses.errorResponse("Internal server error!"));
//       }
//       next(error);
//     }
// }
  
async function updateDataPackage(req, res, next) {
    try {
      const updateDataPackageValidator = ajv.compile(costStructureValidator.updateDataPackage)
      if (!updateDataPackageValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + updateDataPackageValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }

      const data = req.body;
      const updateDataPackage = await costStructureService.updateDataPackage(data);
      res.json(webResponses.successResponse( 'Category updated successfully', updateDataPackage));
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
      res.status(409).json(webResponses.errorResponse("Unavailable name!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
      res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}


async function deleteCategory(req, res, next) {
    try {
      const categoryId = req.params.categoryId;
      const createCategory = await costStructureService.deleteCategory(parseInt(categoryId));
      res.json(webResponses.successResponse( 'Category deleted successfully', createCategory));
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}

async function deleteRow(req, res, next) {
    try {
      const deleteRowValidator = ajv.compile(costStructureValidator.deleteRow)
      if (!deleteRowValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + deleteRowValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }
      
      const rowData = req.body;
      const deletedRow = await costStructureService.deleteRow( rowData );
      res.json(webResponses.successResponse( 'Row deleted successfully', deletedRow));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);

    }
}
  
async function connectData(req, res, next){
    try {
      const connectDataValidator = ajv.compile(costStructureValidator.connectData)
      if (!connectDataValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + connectDataValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }

      const sheetsId = req.params.sheetsId
      const connectData = req.body
      const connect = await costStructureService.connectData(parseInt(sheetsId), connectData);
      res.json(webResponses.successResponse( 'Detail connected successfully', connect));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}
  
async function createPackage(req, res, next){
    try {
      const createPackageValidator = ajv.compile(costStructureValidator.createNewPackage)
      if (!createPackageValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + createPackageValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }

      const sheetsId = req.params.sheetsId
      const packageData = req.body
      const createdPackage = await costStructureService.createPackage(parseInt(sheetsId), packageData);
      res.json(webResponses.successResponse( 'Package created successfully', createdPackage));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}
  
async function updatePackage(req, res, next){
    try {
      const updatePackageValidator = ajv.compile(costStructureValidator.updatePackage)
      if (!updatePackageValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + updatePackageValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }

      const packageData = req.body
      const updatedPackage = await costStructureService.updatePackage(packageData);
      res.json(webResponses.successResponse( 'Package updated successfully', updatedPackage));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}
  
async function deletePackage(req, res, next){
    try {
      const packageId = req.params.packageId
      const deletedPackage = await costStructureService.deletePackage(parseInt(packageId));
      res.json(webResponses.successResponse( 'Package updated successfully', deletedPackage));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Error!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}
  
async function updateTotal(req, res, next){
    try {
      const updateTotalValidator = ajv.compile(costStructureValidator.updateTotal)
      if (!updateTotalValidator(req.body)) {
          res.status(400).json(webResponses.errorResponse('Invalid input! ' + updateTotalValidator.errors[0].message));
          throw new Error('There are several fields empty!');
      }
      const sheetId = req.params.sheetsId
      const totalData = req.body
      const updatedTotal = await costStructureService.updateTotal(parseInt(sheetId), totalData);
      res.json(webResponses.successResponse( 'Total updated successfully', updatedTotal));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        res.status(409).json(webResponses.errorResponse("Unavailable name!"));
      } 
      else if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).json(webResponses.errorResponse("Internal server error!"));
      }
      next(error);
    }
}

module.exports = {
    getCostStructure,
    getDetailList,
    upsertCategory,
    // createNewCategory,
    deleteCategory,
    deleteRow,
    // updateCategory,
    connectData,
    createPackage,
    updatePackage,
    updateDataPackage,
    deletePackage,
    updateTotal,
}
  