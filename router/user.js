const express = require("express");
const multer = require('multer');
const {
    userRegister,
    singleByEmail,
    handleCommunication,
} = require("../controler/userControler");

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post("/register", userRegister);
router.post('/api/send_message', upload.single('attachment'), handleCommunication);
router.get("/singleByEmail/:email", singleByEmail);


module.exports = router;