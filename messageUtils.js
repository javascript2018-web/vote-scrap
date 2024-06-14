const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const authorizationHeader = `AccessKey ${process.env.BIRD_API_KEY}`;
console.log('Authorization Header:', authorizationHeader);

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

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+\d{1,15}$/; // Regex pattern to match + followed by up to 15 digits
  return phoneRegex.test(phoneNumber);
};

const sendSms = async (to, messageText) => {
  if (!isValidPhoneNumber(to)) {
    console.error('Invalid phone number format. It should include country code and start with a + (e.g., +1234567890)');
    return;
  }
  const authorizationHeader = `AccessKey ${process.env.BIRD_API_KEY}`;
  console.log('Authorization Header:', authorizationHeader);
  const smsPayload = {
    body: {
      type: "text",
      text: {
        text: messageText
      }
    },
    receiver: {
      contacts: [
        {
          identifierValue: to,
          identifierKey: "phonenumber"
        }
      ]
    }
  };

  console.log('Sending SMS:', smsPayload);

  try {
    const response = await axios.post(
      'https://api.bird.com/workspaces/ee376371-aff6-4de4-b22d-85dc3f50218f/channels/a46e086e-4fac-42d7-8c42-79246b128399/messages',
      smsPayload,
      {
        headers: {
          'Authorization': authorizationHeader, // Include the API key in the headers
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('SMS sent:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
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
