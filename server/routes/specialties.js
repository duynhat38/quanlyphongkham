var express = require('express');
var router = express.Router();

var SpectaltiesController = require('../controllers/controllers.specialties');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', SpectaltiesController.all);
router.post('/specialty/:specialtyId', SpectaltiesController.getSpecialty);
router.post('/create', SpectaltiesController.create);
router.post('/edit', SpectaltiesController.edit);
router.post('/delete', SpectaltiesController.delete);
router.post('/findSpecialtyByDoctor', SpectaltiesController.findSpecialtyByDoctor);

module.exports = router;