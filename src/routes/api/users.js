const express = require("express");
const router = express.Router();

const usersController = require("../../app/controllers/api/UserController");

const { authenticated } = require('../../app/middlewares/authenticate');

router.get('/', usersController.usersController);
router.post('/register', usersController.registerProcess);
router.post('/login', authenticated, usersController.loginProcess);
// router.post('/updateProfile', usersController.); //sẽ viết sau
router.post('/changePassword/:usernane', usersController.changePassword);
// router.get('/logout', usersController.logout);
module.exports = router;
