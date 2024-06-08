const express = require("express");
const {
    handleCommunication,
} = require("../controler/communicationController");


const router = express.Router();

router.post("/register", handleCommunication);



module.exports = router;