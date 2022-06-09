var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/controllers.users');
const { authPermission } = require('../middlewares/middlewares.auth')

router.post('/auth', UsersController.auth);
router.post('/all', UsersController.get_all_users);
router.post('/change-password', UsersController.change_password);
router.post('/account/:userId', UsersController.getUser);
router.post('/create', UsersController.create);
router.post('/edit', UsersController.edit);
router.post('/delete', UsersController.delete);

router.post('/getDoctors', UsersController.getDoctors);
router.post('/getReceptionists', UsersController.getReceptionists);
router.post('/getPharmacists', UsersController.getPharmacists);


module.exports = router;