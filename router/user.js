const express = require("express");
const {
    userRegister,
    singleByEmail,
    handleCommunication,
} = require("../controler/userControler");


const router = express.Router();

router.post("/register", userRegister);
router.get("/singleByEmail/:email", singleByEmail);


module.exports = router;