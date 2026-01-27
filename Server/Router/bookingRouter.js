const express=require('express');
const router=express.Router();
const middleware=require("../middleware/auth");
const bookingController=require('../Controller/bookingController');

router.post('/createBooking',middleware.authenticate,bookingController.createBooking);
router.get("/availableSlots",bookingController.availableSlots);
router.get("/getBookings",middleware.authenticate,bookingController.getBookings);
router.delete("/cancelBooking/:bookingId",middleware.authenticate,bookingController.cancelBooking);
router.patch("/rescheduleBooking/:bookingId",middleware.authenticate,bookingController.rescheduleBooking);

module.exports=router;