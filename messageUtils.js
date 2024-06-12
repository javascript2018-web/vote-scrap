const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.OUTGOING_SERVER,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email: ', err);
    throw err;
  }
};

// Function to send SMS
const sendSms = async (to, body) => {
  const smsPayload = {
    to,
    message: body,
  };

  console.log('Sending SMS:', smsPayload);

  try {
    const response = await axios.post(process.env.BIRD_SMS_ENDPOINT, smsPayload, {
      headers: {
        'Authorization': `Bearer ${process.env.BIRD_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('SMS sent:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Function to send WhatsApp message
const sendWhatsapp = async (to, message) => {
  const whatsappPayload = {
    to,
    message,
  };

  console.log('Sending WhatsApp message:', whatsappPayload);

  try {
    const response = await axios.post(process.env.BIRD_WHATSAPP_ENDPOINT, whatsappPayload, {
      headers: {
        'Authorization': `Bearer ${process.env.BIRD_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('WhatsApp message sent:', response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

// Export the functions
module.exports = {
  sendEmail,
  sendSms,
  sendWhatsapp,
};
