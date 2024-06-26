const express = require('express');
const router = express.Router();
const costController = require('../../controllers/tariffControllers/costStructureController');

router.get('/sheets/:sheetsId', costController.getCostStructure);
router.get('/detail-list', costController.getDetailList);

router.post('/sheets/:sheetsId/upsert-category', costController.upsertCategory);
// router.post('/sheets/:sheetsId/create-new-category', costController.createNewCategory);
router.post('/sheets/:sheetsId/connect-data', costController.connectData);
router.post('/sheets/:sheetsId/create-new-package', costController.createPackage);


// router.put('/sheets/:sheetsId/update-category', costController.updateCategory);
router.put('/update-package', costController.updatePackage);
router.put('/sheets/:sheetsId/update-total', costController.updateTotal);
router.put('/update-data-package', costController.updateDataPackage);



router.delete('/delete-category/:categoryId', costController.deleteCategory);
router.delete('/delete-package/:packageId', costController.deletePackage);
router.delete('/delete-row', costController.deleteRow);



module.exports = router;

