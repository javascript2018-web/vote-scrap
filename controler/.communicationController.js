// communicationController.js
const { sendEmail, sendSms, sendWhatsapp } = require('./messageUtils');
const cloudinary = require('cloudinary').v2;
const Message = require('../models/Message'); // replace with your actual message model file path

exports.handleCommunication = async (req, res, next) => {
  res.header('Content-Type', 'application/json');

  try {
    const { subject, content, group, messageType } = req.body;
    console.log('Initial Request Body:', req.body);

    // Ensure empty group is handled
    if (!group) {
      throw new Error('Group (phone number or email) is required');
    }

    let attachmentUrl = '';
    if (req.file) {
      console.log('Uploading file to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path);
      attachmentUrl = result.secure_url;
      console.log('File uploaded to Cloudinary:', attachmentUrl);
    }

    // Save the message to the database
    const newMessage = new Message({
      subject,
      content,
      group,
      attachmentUrl,
      messageType,
    });

    console.log('Saving message to database:', newMessage);
    await newMessage.save();
    console.log('Message saved to database');

    // Send message based on type
    if (messageType === 'email') {
      await sendEmail(group, subject, content);
    } else if (messageType === 'sms') {
      await sendSms(group, content);
    } else if (messageType === 'whatsapp') {
      await sendWhatsapp(group, content);
    } else {
      throw new Error('Invalid message type');
    }

    res.status(200).send('Message sent and saved successfully.');
  } catch (error) {
    console.error('Error sending and saving message:', error);
    res.status(500).send(`Error sending and saving message: ${error.message}`);
  }
};