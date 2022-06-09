var express = require('express');
var router = express.Router();

var AuthController = require('../controllers/controllers.auth');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/forgot-password', AuthController.forgot_password)

router.post('/reset-password', AuthController.reset_password)

module.exports = router;