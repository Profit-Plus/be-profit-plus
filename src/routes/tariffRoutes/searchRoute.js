const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/tariffControllers/searchController');

router.get('/product', searchController.searchProduct);
router.get('/category', searchController.searchCategory);
router.get('/component', searchController.searchComponent);

module.exports = router;