const { createOrder } = require("../Service/cashfreeService");
const path = require("path");
const {cashfree} = require("../Service/cashfreeService");
const user=require("../models/user");
const sequelize = require("../utils/db-connection");
const payment= require("../models/payment");
const appointment = require("../models/appointment");
const Sib = require("sib-api-v3-sdk");
const service= require("../models/service");

exports.getPaymentPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "View", "index.html"));
};



exports.processPayment = async (req, res) => {


  try{
    const db = await appointment.findOne({
      where: {
        id: req.body.appointmentId
      },
      include: [
        {
          model: service,
          attributes: ["servicePrice"]
        },
        {
          model: user,
          attributes: ["phone"]
        }
      ]
    });

    const orderId = "ORDER-" + Date.now();
    const orderAmount = db.service.servicePrice;
    const orderCurrency = "INR";
    const customerPhone = db.User.phone;
    const customerID = "1"




    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );

    await payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "pending",
      appointmentId:req.body.appointmentId
    });

    res.status(200).json({ paymentSessionId, orderId});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStatus = async (req,res) => {
  const t=await sequelize.transaction();
  try {
    const orderId=req.params.orderId;
    const response = await cashfree.PGOrderFetchPayments(orderId);
    console.log("Order fetched successfully:", response.data);

    let getOrderResponse = response?.data ?? response;

    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
   await payment.update({
    paymentStatus: orderStatus

   },
   {
    where:{
        orderId:orderId
    },
    transaction:t
   }
     )
    const payment_details= await payment.findOne({
      where:{
        orderId:orderId
      },transaction:t
     })
     console.log(payment_details);

     const db = await appointment.findOne({
      where: {
        id: payment_details.appointmentId
      },
      include: [
        {
          model: user,
          attributes: ["email"]
        }
      ],
      transaction:t
    });
     if(orderStatus=="Success")
     {
     await appointment.update({
           status:"BOOKED"
     },{
     where:{
      id:payment_details.appointmentId
     },
     transaction:t
    }
    )
     const appointment_details= await appointment.findOne({
      where:{
        id:payment_details.appointmentId
      },transaction:t
     })
     console.log(appointment_details);
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
   // console.log(apiKey.apiKey);
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "asadshakri3127@gmail.com",
      name: "Salon Appointment System",
    };

    const receivers = [
      {
        email: db.User.email
      },
    ];

    const responseBrevo = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Salon Booking Confirmation",
      htmlContent: `
      <h3>BOOKING DETAILS</h3>
      <p>${appointment_details.time}</p>
      <p>${appointment_details.date}</p>
      <p>${appointment_details.staffName}</p>
      <p>${appointment_details.status}</p>`
    });
  }
  else if(orderStatus=="Failure")
  {
    await appointment.destroy({
      where:{
        id:payment_details.appointmentId
      },
      transaction:t
    });
  }
    await t.commit();
    res.status(200).json({orderStatus,orderId});
  } 
 

  catch (error) {
    await t.rollback();
    console.log(
      "Error:",
      error?.response?.data?.message || error.message
    );
    res.status(500).json({ message: error.message });
  }
};
