var express = require('express');
var router = express.Router();

var ServicesController = require('../controllers/controllers.services');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', ServicesController.all);
router.post('/service/:serviceId', ServicesController.getService);
router.post('/create', ServicesController.create);
router.post('/edit', ServicesController.edit);
router.post('/delete', ServicesController.delete);

module.exports = router;