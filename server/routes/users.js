var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/controllers.users');
var UsersValidation = require('../validation/validation.users');
const AuthMiddleware = require('../middlewares/middlewares.auth');

router.post('/', AuthMiddleware.user, UsersController.index);
router.post('/all', AuthMiddleware.admin, UsersController.get_all_users);
router.post('/delete', AuthMiddleware.admin, UsersController.delete_user);
router.post('/change-password', AuthMiddleware.user, UsersValidation.change_password, UsersController.change_password)

module.exports = router;