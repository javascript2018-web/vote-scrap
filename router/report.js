// routes/communicationRoutes.js
const express = require('express');
const multer = require('multer');
const { handleCommunication } = require('../controllers/communicationController'); // Adjust path as needed

const storage = multer.memoryStorage(); // Use memory storage for serverless compatibility
const upload = multer({ storage });

const router = express.Router();

router.post('/send_message', upload.single('attachment'), handleCommunication);

module.exports = router;
