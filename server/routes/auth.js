var express = require('express');
var router = express.Router();

var AuthValidation = require('../validation/validation.auth');

var AuthController = require('../controllers/controllers.auth');

router.post('/register', AuthValidation.register, AuthController.register);

router.post('/login', AuthValidation.login, AuthController.login);

router.post('/forgot-password', AuthValidation.forgot_password, AuthController.forgot_password)

router.post('/reset-password', AuthValidation.reset_password, AuthController.reset_password)

module.exports = router;