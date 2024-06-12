const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  subject: String,
  content: String,
  group: String,
  attachmentUrl: String,
  messageType: { type: String, enum: ['email', 'sms', 'whatsapp'] },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        // Only validate email if messageType is 'email'
        if (this.messageType === 'email') {
          return /\S+@\S+\.\S+/.test(v); // Simple email regex for validation
        }
        return true; // Otherwise, validation passes
      },
      message: props => `${props.value} is not a valid email address!`
    }
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
