// File path: /routes/masterRoute.js

const express = require('express');
const router = express.Router();

const masterController = require('../../controllers/tariffControllers/masterPackageController');

// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.get('/getAllData', masterController.getAllData);
router.get('/getDataById/:data_id', masterController.getDataById);
router.post('/createData', masterController.createData);
router.put('/updateDataById/:data_id', masterController.updateDataById);
router.delete('/deleteDataById/:data_id', masterController.deleteDataById);
router.delete('/deleteComponentById/:component_id', masterController.deleteComponentById);
router.post('/addRelation', masterController.addRelation);

module.exports = router;