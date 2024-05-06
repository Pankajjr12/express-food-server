const User = require("../models/User");
const nodemailer = require("nodemailer");

//get All users

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create a new user

const createUser = async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(302).json({ message: "User already exists" });
    }
    const result = await User.create(user);
    res
      .status(200)
      .json({ message: "User created successfully", user: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { displayName, photoURL } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { displayName, photoURL },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //   res.status(200).json(deleteUser);
};

//code for getting the admin

// get admin
const getAdmin = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  try {
    const user = await User.findOne(query);
    console.log(user);
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// make the admin
const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  const { name, email, photoURL, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMail = async (req, res) => {
  const { username, email, about } = req.body;
  
  // Check if the user is authenticated
  if (!req.decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const loggedInUserEmail = req.decoded.email;
   // Assuming the user email is stored in req.decoded
  console.log(loggedInUserEmail)
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PWD,
    },
  });

  // Configure the email options
  let mailOptions = {
    from: loggedInUserEmail,
    to: process.env.GMAIL_USER,
    subject: `Query from user ${username} `,
    text: `Email: ${loggedInUserEmail}\n\nMessage:\n ${about}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};





module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getAdmin,
  makeAdmin,
  updateProfile,
  sendMail,
};
