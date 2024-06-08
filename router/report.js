const express = require("express");
// const multer = require('multer');
const {
    handleCommunication,
} = require("../controler/communicationController");

// const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/send_message',  handleCommunication);

module.exports = router;