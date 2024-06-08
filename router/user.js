const express = require("express");
const {
    userRegister,
    singleByEmail

} = require("../controler/userControler");

const router = express.Router();

router.post("/register", userRegister);
router.post("/api/send_message", userRegister);
router.get("/singleByEmail/:email", singleByEmail);


module.exports = router;