const express = require('express');
const router = express.Router();

const offeringCalculationController = require('../../controllers/tariffControllers/offeringController');

router.post('/createOffering/:sheet_id', offeringCalculationController.createOffering);
router.get('/getOffering/:sheet_id', offeringCalculationController.getOffering);
router.get('/getDetailsOfferingById/:sheet_id', );
router.delete('/deleteOffering', );
router.put('/updateOffer/:offering_id', offeringCalculationController.updateOffering);

module.exports = router;