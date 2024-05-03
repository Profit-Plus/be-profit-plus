const express = require('express');
const router = express.Router();
const masterPackageController = require('../../controllers/tariffControllers/masterPackageController');

router.post('/data', masterPackageController.createData);
router.get('/data', masterPackageController.getAllData);
router.get('/data/:id', masterPackageController.getDataById);
router.put('/data/:id', masterPackageController.updateData);
router.delete('/data/:id', masterPackageController.deleteData);
router.post('/component', masterPackageController.createComponent);
router.get('/component', masterPackageController.getAllComponents);
router.get('/component/:id', masterPackageController.getComponentById);
router.put('/component/:id', masterPackageController.updateComponent);
router.delete('/component/:id', masterPackageController.deleteComponent);

module.exports = router;
