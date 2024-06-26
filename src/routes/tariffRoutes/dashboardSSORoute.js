const express = require('express');
const router = express.Router();
const dashboardSSOController = require('../../controllers/tariffControllers/dashboardSSOController');

router.get('/sso', dashboardSSOController.getSso);
router.get('/sheet', dashboardSSOController.getSheet);
router.get('/user', dashboardSSOController.getUser);
router.get('/unit', dashboardSSOController.getUnit);

router.put('/sso/:id', dashboardSSOController.updateSso);

router.post('/sso', dashboardSSOController.createSso);

module.exports = router;