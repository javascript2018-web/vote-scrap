const UserDB = require("../modal/userModal");
const sendToken = require("../utilities/sendToken");
const bcrypt = require('bcrypt');


exports.userRegister = async (req, res, next) => {
    const { fullName, email, password, userId } = req.body;
    console.log(req.body);
  
    try {
      const user = await UserDB.findOne({ email });
      if (user) {
        return res
          .status(202)
          .send({ success: false, message: "User already exists" });
      }
  
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      console.log("Generated Salt:", salt);
  
      const hashedPassword = await bcrypt.hash(`${password}`, salt);
      console.log("Hashed Password:", hashedPassword);
  
      const addedUser = await UserDB.create({
        fullName,
        email,
        password: hashedPassword,
        userId: userId,
      });
  
      sendToken(addedUser, 200, res);
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: false, message: "Server Error" });
}}

exports.singleByEmail = async (req, res, next) => {
    console.log("Received request to fetch user by email:", req.params.email);
    
    try {
      const userEmail = req.params.email;
  
      // Fetch the user from the database using the provided email
      const user = await UserDB.findOne({ email: userEmail });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }}


// communicationController.js
// communicationController.js
const { sendEmail, sendSms, sendWhatsapp } = require('./messageUtils');
const cloudinary = require('cloudinary').v2;
const Message = require('../models/Message');

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

