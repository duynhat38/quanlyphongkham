var express = require('express');
var router = express.Router();

var ClinicsController = require('../controllers/controllers.clinics');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', ClinicsController.all);
router.post('/clinic/:clinicId', ClinicsController.getClinic);
router.post('/create', ClinicsController.create);
router.post('/edit', ClinicsController.edit);
router.post('/delete', ClinicsController.delete);

router.post('/addDoctor', ClinicsController.addDoctor);
router.post('/deleteDoctor', ClinicsController.deleteDoctor);
router.post('/addReceptionist', ClinicsController.addReceptionist);
router.post('/deleteReceptionist', ClinicsController.deleteReceptionist);
router.post('/addPharmacist', ClinicsController.addPharmacist);
router.post('/deletePharmacist', ClinicsController.deletePharmacist);
router.post('/findClinicByReceptionist', ClinicsController.findClinicByReceptionist);


module.exports = router;