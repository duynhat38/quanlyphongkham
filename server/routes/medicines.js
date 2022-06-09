var express = require('express');
var router = express.Router();

var MedicinesController = require('../controllers/controllers.medicines');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', MedicinesController.all);
router.post('/medicine/:medicineId', MedicinesController.getMedicine);
router.post('/create', MedicinesController.create);
router.post('/edit', MedicinesController.edit);
router.post('/import', MedicinesController.import);
router.post('/delete', MedicinesController.delete);

module.exports = router;