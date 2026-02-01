const cron = require("node-cron");
const { Op } = require("sequelize");
const Appointment = require("../models/appointment");
const User = require("../models/user");
const Sib = require("sib-api-v3-sdk");

const sendReminderEmails = async () => {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 24*60*60*1000);

    const date = reminderTime.toISOString().split("T")[0];

    const appointments = await Appointment.findAll({
      where: {
        date,
        status: "BOOKED"
      },
      include: [
        {
          model: User,
          attributes: ["email", "name"]
        }
      ]
    });

    if (!appointments.length) return;

    const client = Sib.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    for (const appt of appointments) {
      await tranEmailApi.sendTransacEmail({
        sender: {
          email: "asadshakri3127@gmail.com",
          name: "Salon Appointment System"
        },
        to: [{ email: appt.User.email }],
        subject: "Appointment Reminder",
        htmlContent: `
          <h3>Appointment Reminder</h3>
          <p>Hello ${appt.User.name},</p>
          <p>This is a reminder for your salon appointment.</p>
          <p><b>Date:</b> ${appt.date}</p>
          <p><b>Time:</b> ${appt.time}</p>
          <p><b>Staff:</b> ${appt.staffName}</p>
        `
      });
    }

    console.log("Appointment reminders sent");
  } catch (err) {
    console.error("Reminder error:", err.message);
  }
};


cron.schedule("0 * * * *", sendReminderEmails);

module.exports = sendReminderEmails;