// routes/createSheetRoute.js
const express = require('express');
const router = express.Router();
const createSheetController = require('../../controllers/tariffControllers/createSheetController');

// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

router.post('/createsheet', createSheetController.createSheet);
router.get('/types/:sheetId', createSheetController.getTypesBySheetId);

module.exports = router;
