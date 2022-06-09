var express = require('express');
var router = express.Router();

var PrescriptionsController = require('../controllers/controllers.prescriptions');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', PrescriptionsController.all);
router.post('/getPrescriptionsOfPatient', PrescriptionsController.getPrescriptionsOfPatient);
router.post('/prescription/:prescriptionId', PrescriptionsController.getPrescription);
router.post('/create', PrescriptionsController.create);
router.post('/edit', PrescriptionsController.edit);
router.post('/delete', PrescriptionsController.delete);

module.exports = router;