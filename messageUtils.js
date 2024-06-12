const axios = require('axios');
const net = require('net');
require('dotenv').config();

// Function to send email using raw SMTP
const sendEmail = async (to, subject, text) => {
  const email = {
    to:email,
    from: process.env.EMAIL_USER,
    subject,
    text,
  };

  console.log('Sending Email:', email);

  return new Promise((resolve, reject) => {
    const client = net.createConnection({
      port: process.env.SMTP_PORT,
      host: process.env.OUTGOING_SERVER,
    });

    client.setEncoding('utf8');

    client.on('connect', () => {
      client.write('HELO vchurch.us\r\n');
      client.write('AUTH LOGIN\r\n');
      client.write(Buffer.from(process.env.EMAIL_USER).toString('base64') + '\r\n');
      client.write(Buffer.from(process.env.EMAIL_PASS).toString('base64') + '\r\n');
      client.write(`MAIL FROM:<${process.env.EMAIL_USER}>\r\n`);
      client.write(`RCPT TO:<${email.to}>\r\n`);
      client.write('DATA\r\n');
      client.write(`Subject: ${subject}\r\n`);
      client.write(`Content-Type: text/plain; charset=utf-8\r\n`);
      client.write('\r\n');
      client.write(`${text}\r\n`);
      client.write('.\r\n');
      client.write('QUIT\r\n');
      client.end();
    });

    client.on('data', (data) => {
      console.log('SMTP Server Response:', data);
      if (data.includes('250 OK')) {
        resolve();
      } else if (data.includes('error') || data.includes('failed')) {
        reject(new Error(data));
      }
    });

    client.on('error', (err) => {
      console.error('Error sending email:', err);
      reject(err);
    });
  });
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
