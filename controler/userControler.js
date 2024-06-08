const User = require("../modal/userModal");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res, next) => {
  const { data } = req.body;
  console.log(data);
  try {
    const user = await User.findOne({ voterid: data.voterid });

    if (user) {
      return res
        .status(202)
        .send({ success: false, message: "User already exists" });
    }

    const addedUser = await User.create({
      ...data,
    });
    res.status(200).json({ success: true, addedUser });
  } catch (e) {
    console.log(e);
  }
};

exports.getSingleUser = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email;

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });
    console.log("dfdfdf");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { voterid } = req.query;

    const user = await User.findOne({ voterid });

    res.json(user);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.postVote = async (req, res, next) => {
  try {
    const { voterid } = req.query;
    const body = req.body;
    console.log(body);
    const updatedUser = await User.findOneAndUpdate(
      { voterid },
      { $set: { vote: body.vote } },
      { new: true, upsert: true } // Combine options correctly
    );

    res.json(updatedUser);
    console.log(updatedUser);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.allUser = async (req, res, next) => {
  try {
    const user = await User.find({});

    res.json(user);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
