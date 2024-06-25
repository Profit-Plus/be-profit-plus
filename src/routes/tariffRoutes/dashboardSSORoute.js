const express = require('express');
const router = express.Router();
const dashboardSSOController = require('../../controllers/tariffControllers/dashboardSSOController');

router.get('/Sso', dashboardSSOController.getSso);
router.get('/SsoById/:id', dashboardSSOController.getSsoById);
router.put('/Sso/:id', dashboardSSOController.updateSso);

router.post('/Sso', dashboardSSOController.createSso);

module.exports = router;

// Path: src/routes/tariffRoutes/dashboardOverviewRoute.js