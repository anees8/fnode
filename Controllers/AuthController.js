const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const path = require("path");
const fs = require("fs");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const register = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  try {
    
    const hashedPwd = await bcrypt.hash(password, 10);
    let user = new User({
      name,
      email,
      phone,
      password: hashedPwd
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
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const matches = await bcrypt.compare(password, user.password);
      if (matches) {
        const token = jwt.sign(
          { userId: user._id,role:user.role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
          }
        );
        return res.status(200).json({ success: true, token });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Invalid email or password" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const randomtoken = Math.floor(100000 + Math.random() * 900000);
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomtoken } }
      );

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        requireTLS: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: user.email,
        subject: "For Reset Password",
        html:
          '<!DOCTYPE html><html><head><title>OTP Token Email</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>Dear  ' +
          user.name +
          ",</p><p>Thank you for choosing our service.</p><h3>Your One-Time Password (OTP) token is: <strong>" +
          randomtoken +
          "</strong></h3><p>Please enter this token in the required field to complete the verification process.</p><p>If you did not request this OTP token, please contact us immediately.</p><p>Thank you for your cooperation.</p><p>Sincerely,<br>OTP Service Team</p></body></html>"
      };

      let info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(400).json({ success: false, error });
        }
      });

      return res.status(200).json({
        success: true,
        message: "The token has been successfully sent to your email address",
        data
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const ResetPassword = async (req, res, next) => {
  const { token, email, password } = req.body;
  try {
    const user = await User.findOne({ email, token });
    if (user) {
      const hashedPwd = await bcrypt.hash(password, 10);

      let updateData = {
        password: hashedPwd,
        token: ""
      };
      const data = await User.findByIdAndUpdate(user._id, { $set: updateData });
      return res
        .status(200)
        .json({ success: true, message: "Password Updated Successfully  " });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Enter Otp has been expired" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const usersprofile = async (req, res, next) => {
  let userProfile;
  let file;
  let filename;
  const { phone, user_id } = req.body;

  if (req.files && req.files.profileImage) {
    file = req.files.profileImage;
    filename = "uploads/" + file.name;
  }

  try {
    const userprofileexists = await UserProfile.findOne({ user_id });

    if (userprofileexists) {
      if (file) {
        if (fs.existsSync(`public/${userprofileexists.profileImage}`)) {
          // If it does, remove it from the location
          fs.unlinkSync(`public/${userprofileexists.profileImage}`);
        }
      }

      await UserProfile.findOneAndUpdate(
        { user_id },
        { $set: { phone, profileImage: filename } }
      );

      userProfile = await UserProfile.findOne({ user_id }).populate("user_id", [
        "name",
        "email"
      ]);
    } else {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "No files were uploaded." });
      }

      userProfile = await UserProfile.create({
        phone,
        user_id,
        profileImage: filename
      });
    }

    if (file) {
      file.mv("public/uploads/" + file.name, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "User Profile Updated successfully",
        userProfile
      });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

const logout = async (req, res, next) => {
  try {
      const token = req.headers.authorization.split(' ')[1]; 
    return res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

module.exports = {
  register,
  login,logout,
  forgetPassword,
  ResetPassword,
  usersprofile
};
