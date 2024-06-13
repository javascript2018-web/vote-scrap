// clientModel.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: String,
    mail: String,
    email: String,
    phone: String,
    country: String,
    city: String,
    state: String,
    group: String,
    userEmail: String
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
