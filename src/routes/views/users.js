const express = require('express');
const router = express.Router();

const usersController = require('../../app/controllers/views/UserController');

router.get('/login', usersController.login);
router.post('/login', usersController.loginProcess);
router.get('/register', usersController.register);
router.post('/register', usersController.registerProcess);

module.exports = router;