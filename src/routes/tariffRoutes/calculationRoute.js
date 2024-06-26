// routes/calculationRoutes.js
const express = require('express');
const router = express.Router();
const calculationController = require('../../controllers/tariffControllers/calculationController');


// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Ganti dengan URL front-end yang tepat
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


router.get('/getCalculation/:sheet_id', calculationController.getCalculation);
router.get('/getCalculationById/:package_id', calculationController.getCalculationById);
router.put('/putCalculation/:package_id', calculationController.putCalculation);

module.exports = router;