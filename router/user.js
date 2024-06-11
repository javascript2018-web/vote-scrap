const express = require("express");
const {
    userRegister,
    singleByEmail,
    getAllUser,
} = require("../controler/userControler");


const router = express.Router();

router.post("/register", userRegister);
router.get("/singleByEmail/:email", singleByEmail);
router.get("/allusers", getAllUser)

module.exports = router;