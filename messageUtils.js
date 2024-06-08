// messageUtils.js
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmail = async (to, subject, text) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const email = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
  };
  console.log('Sending Email:', email);
  await sgMail.send(email);
};

const sendSms = async (to, body) => {
  const sms = {
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body,
  };
  console.log('Sending SMS:', sms);
  await client.messages.create(sms);
};

const sendWhatsapp = async (to, message) => {
  const whatsapp = {
    body: message,
    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    to: `whatsapp:${to}`,
  };
  console.log('Sending WhatsApp message:', whatsapp);
  await client.messages.create(whatsapp);
};

module.exports = {
  sendEmail,
  sendSms,
  sendWhatsapp,
};
