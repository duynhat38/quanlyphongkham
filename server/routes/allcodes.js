var express = require('express');
var router = express.Router();

var AllcodesController = require('../controllers/controllers.allcodes');
const { authPermission } = require('../middlewares/middlewares.auth')

router.post('/', AllcodesController.index);

module.exports = router;