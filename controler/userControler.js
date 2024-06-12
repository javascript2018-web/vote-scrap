const UserDB = require("../modal/userModal");
const sendToken = require("../utilities/sendToken");
const bcrypt = require('bcrypt');


exports.userRegister = async (req, res, next) => {
    const { fullName, email, password, userId } = req.body;
    console.log(req.body);
  
    try {
      const user = await UserDB.findOne({ email });
      if (user) {
        return res
          .status(202)
          .send({ success: false, message: "User already exists" });
      }
  
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      console.log("Generated Salt:", salt);
  
      const hashedPassword = await bcrypt.hash(`${password}`, salt);
      console.log("Hashed Password:", hashedPassword);
  
      const addedUser = await UserDB.create({
        fullName,
        email,
        password: hashedPassword,
        userId: userId,
      });
  
      sendToken(addedUser, 200, res);
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: false, message: "Server Error" });
}}

exports.singleByEmail = async (req, res, next) => {
    console.log("Received request to fetch user by email:", req.params.email);
    
    try {
      const userEmail = req.params.email;
  
      // Fetch the user from the database using the provided email
      const user = await UserDB.findOne({ email: userEmail });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
}}

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await UserDB.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}


exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await UserDB.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
};


exports.handleDelete = async (req, res) => {
  try {
    const result = await UserDB.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: 'user not found' });
    }
    res.send({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error });
  }
}

exports.createAdmin = async (req, res) => {
  const { name, email, whatsapp, phone, password,userId, confirmPassword } = req.body;
console.log(req.body)
  // Basic validation
  if (!name || !email || !whatsapp || !phone || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Please fill out all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if the admin already exists
    const adminExists = await UserDB.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new UserDB({
      fullName: name,
      email,
      whatsapp,
      phone,
      password: hashedPassword,
      userId: userId,
      role: 'admin'
    });
    console.log("jjj",newAdmin)
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Error creating admin' });
  }
};
