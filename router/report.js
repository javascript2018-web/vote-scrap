const express = require("express");
const {
    handleCommunication,
} = require("../controler/communicationController");


const router = express.Router();

router.post("/api/send_message", handleCommunication);



module.exports = router;