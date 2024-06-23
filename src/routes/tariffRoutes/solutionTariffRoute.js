const express = require('express');
const router = express.Router();
const solutionTariffController = require('../../controllers/tariffControllers/solutionTariffController');

router.get('/GTOM/:id', solutionTariffController.getSolutionGTOMTariff);
router.get('/Portofolio/:id', solutionTariffController.getSolutionPortofolioTariff);

module.exports = router;