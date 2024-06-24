// routes/componentRoute.js
const express = require('express');
const router = express.Router();
const componentController = require('../../controllers/tariffControllers/componentController');


// Middleware untuk menambahkan header CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


router.get('/getAllComponents', componentController.getAllComponents);
router.delete('/deleteComponentById/:id', componentController.deleteComponentById);
router.post('/createComponent', componentController.createComponent);
router.put('/updateComponentById/:id', componentController.updateComponentById);

module.exports = router;
