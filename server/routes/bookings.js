var express = require('express');
var router = express.Router();

var BookingsController = require('../controllers/controllers.bookings');
const { authPermission } = require('../middlewares/middlewares.auth');

router.post('/all', BookingsController.all);
router.post('/getAllBookingsBySpecialty', BookingsController.getAllBookingsBySpecialty);
router.post('/booking/:bookingId', BookingsController.getBooking);
router.post('/create', BookingsController.create);
router.post('/very', BookingsController.very);
router.post('/edit', BookingsController.edit);
router.post('/delete', BookingsController.delete);
router.post('/healthcare', BookingsController.healthcare);

module.exports = router;