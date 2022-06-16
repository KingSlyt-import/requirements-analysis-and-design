const express = require("express");
const router = express.Router();

const homeController = require("../../app/controllers/views/HomeController");
const { authenticate } = require("../../app/middlewares/authenticate");

router.get("/", authenticate, homeController.showAllBikes);

module.exports = router;