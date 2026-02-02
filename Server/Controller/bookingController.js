const Appointment = require("../models/appointment");
const ServiceAvailability = require("../models/serviceAvail");
const Service = require("../models/service");
const Staff = require("../models/staff");
const StaffAvailability = require("../models/staffAvail");


  const availableSlots = async (req, res) => {
    try {
      const { serviceId, date } = req.query;
  
      if (!serviceId || !date) {
        return res.status(400).json({ message: "serviceId and date are required" });
      }
  
      const selectedDate = new Date(date);
      const day = selectedDate.toLocaleDateString("en-US", {
        weekday: "long"
      });
      const appointmentDate = selectedDate.toISOString().split("T")[0];
      console.log("Selected Date:", date);
      console.log("Day:", day);
  
      const serviceDay = await ServiceAvailability.findOne({
        where: {
          ServiceId: serviceId,
          day
        }
      });
  
      if (!serviceDay) {
        return res.json([]);
      }
  
  
      const staffList = await Staff.findAll({
        include: [
          {
            model: Service,
            where: { id: serviceId }
          },
          {
            model: StaffAvailability,
            as: "StaffAvails"
          }
        ]
      });
  console.log("Staff List:", staffList);
   
      const bookings = await Appointment.findAll({
        where: { date: appointmentDate  }
      });
  
      const bookedMap = {};
      bookings.forEach(b => {
        bookedMap[`${b.StaffId}-${b.time}`] = true;
      });
  

      const result = [];
      staffList.forEach(staff => {
        staff.StaffAvails.forEach(av => {
          const isBooked = bookedMap[`${staff.id}-${av.time}`];
  
          if (!isBooked) {
            result.push({
              date,
              day,
              time: av.time,
              staffId: staff.id,
              staffName: staff.name
            });
          }
        });
      });
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

const createBooking = async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, staffId, date, time, staffName } = req.body;

  const exists = await Appointment.findOne({
    where: { staffId, date, time }
  });


  if (exists) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  const appointment=await Appointment.create({
    customerName,
    customerPhone,
    serviceId,
    staffId,
    date,
    time,
    staffName,
    status: "PENDING",
    customerId: req.user.id
  });

  res.json({appointmentId:appointment.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getBookings= async (req,res)=>{
  try{
   console.log("User ID:", req.user.id);
   console.log("Admin ID:", process.env.ADMIN_ID);
    if(req.user.id===process.env.ADMIN_ID){
      const allBookings= await Appointment.findAll();
      return res.status(200).json({bookings:allBookings});
    }

    const bookings= await Appointment.findAll({
      where:{
        customerId:req.user.id
      }
    });
    res.status(200).json({bookings});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

const cancelBooking= async (req,res)=>{
  try{
   
    const bookingId=req.params.bookingId;
    await Appointment.destroy({
      where:{
        id:bookingId,
        customerId:req.user.id
      }
    });
    res.status(200).json({message:"Booking cancelled successfully"});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

const rescheduleBooking= async (req,res)=>{
  try{
    const bookingId=req.params.bookingId;
    const {date,time,staffId,staffName}=req.body;
    const booking= await Appointment.findOne({
      where:{
        id:bookingId,
        customerId:req.user.id
      }
    });
    const exists = await Appointment.findOne({
      where: { staffId, date, time }
    });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    await Appointment.update(
      {date,time,staffId,staffName},
      {
        where:{
          id:bookingId,
          customerId:req.user.id
        }
      }
    );
    res.status(200).json({message:"Booking rescheduled successfully"});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = { availableSlots, createBooking ,getBookings,cancelBooking,rescheduleBooking};