const express = require('express');
const router = express.Router();

const homeController = require('../../app/controllers/api/HomeController');

router.get('/', homeController.showAllBikes);

module.exports = router;