const express = require("express");
const {
    userRegister,
    singleByEmail

} = require("../controler/userControler");

const router = express.Router();

router.post("/register", userRegister);
app.post('/api/send_message', upload.single('attachment'), handleCommunication);
router.get("/singleByEmail/:email", singleByEmail);


module.exports = router;