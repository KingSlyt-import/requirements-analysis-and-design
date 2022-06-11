const express = require("express");
const router = express.Router();

const usersController = require("../../app/controllers/api/UserController");

router.get('/', usersController.usersController);
router.post('/register', usersController.registerProcess);
router.post('/login', usersController.loginProcess);
// router.post('/updateProfile', usersController.); //sẽ viết sau
router.post('/changePassword', usersController.changePassword);

module.exports = router;
