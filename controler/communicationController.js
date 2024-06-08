// communicationController.js
const { sendEmail, sendSms, sendWhatsapp } = require('../messageUtils');
const cloudinary = require('cloudinary').v2;
const Message = require('../modal/Message');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handleCommunication = async (req, res) => {
  try {
    res.header('Content-Type', 'application/json');

    console.log('Raw Request Body:', req.body);

    const { subject, content, group, messageType } = req.body;

    if (!group) {
      return res.status(400).json({ error: 'Group (phone number or email) is required' });
    }

    let attachmentUrl = '';
    if (req.file) {
      console.log('Uploading file to Cloudinary...');
      try {
        // Utilize Cloudinary's upload_stream API for buffer uploads
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          });
          stream.end(req.file.buffer);
        });

        attachmentUrl = result.secure_url;
        console.log('File uploaded to Cloudinary:', attachmentUrl);
      } catch (err) {
        return res.status(500).json({ error: 'Cloudinary upload error', details: err.message });
      }
    }

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

    try {
      if (messageType === 'email') {
        await sendEmail(group, subject, content);
      } else if (messageType === 'sms') {
        await sendSms(group, content);
      } else if (messageType === 'whatsapp') {
        await sendWhatsapp(group, content);
      } else {
        return res.status(400).json({ error: 'Invalid message type' });
      }
      res.status(200).send('Message sent and saved successfully.');
    } catch (sendError) {
      console.error('Error sending message:', sendError);
      res.status(500).json({ error: 'Error sending message', details: sendError.message });
    }
  } catch (error) {
    console.error('Error sending and saving message:', error);
    res.status(500).json({ error: 'Error sending and saving message', details: error.message });
  }
};
