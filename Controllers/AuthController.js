const User = require("../models/User");

const register = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    let user = new User({
      name,
      email,
      phone,
      password
    });
    const data = await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User registered successfully", data });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // compare passwords using the matchPassword method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await user.getSignedJwtToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

module.exports = { register, login };
