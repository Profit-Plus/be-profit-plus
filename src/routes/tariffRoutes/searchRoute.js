const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/tariffControllers/searchController');

router.get('/', searchController.search);

module.exports = router;