import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // creating random salt for encryption
    const salt = await bcrypt.genSalt();

    // hashes password
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();

    // status code 201 = something created
    res.status(201).json(savedUser);
  } catch (err) {
    // status code 500 = error code
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // finding the specified email
    // status 400 = bad request
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // password checker
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // secret token for logged in user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // delete password so frontend doesn't see the password
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    // status code 500 = error code
    res.status(500).json({ error: err.message });
  }
};
