// routes/communicationRoutes.js
const express = require('express');
const multer = require('multer');
const { handleCommunication } = require('../controler/communicationController'); // Adjust the path as needed

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/send_message', (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error', details: err.message });
    }
    next();
  });
}, handleCommunication);

module.exports = router;
