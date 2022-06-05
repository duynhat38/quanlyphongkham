var express = require('express');
var router = express.Router();

var PatientsController = require('../controllers/controllers.patients');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', PatientsController.all);
router.post('/patient/:patientId', PatientsController.getPatient);
router.post('/create', PatientsController.create);
router.post('/edit', PatientsController.edit);
router.post('/delete', PatientsController.delete);

module.exports = router;