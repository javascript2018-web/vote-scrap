const express = require("express");
const {
  registerUser,
  getUserByEmail,
  allUser,
  postVote,
} = require("../controler/userControler");
const router = express.Router();

// import all controler
router.post("/register", registerUser);
router.post("/vote", postVote);
router.get("/peruser", getUserByEmail);
router.get("/all", allUser);
// router.get("/", findUser);

module.exports = router;
