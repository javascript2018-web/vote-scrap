// routes/communicationRoutes.js
const express = require('express');

const { handleCommunication } = require('../controllers/communicationController'); 


const router = express.Router();

router.post('/send_message',  handleCommunication);

module.exports = router;
