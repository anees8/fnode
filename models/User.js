const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required?"]
    },
    email: {
      type: String,
      required: [true, "Email must be required"],
      lowercase: true,
      unique: [true, "Email Address Already Exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please Enter Valid Email Address"
      ]
    },

    phone: {
      type: String,
      required: [true, "Phone must be required"],
      minLength: [10, "Phone should  have minimum 10 digits"],
      maxLength: [10, "Phone should  have maximum 10 digits"],
      match: [/\d{10}/, "Phone should  only have digits"]
    },
    password: {
      type: String,
      required: [true, "Password must be required?"],
      minLength: [6, "Password should  have minimum 6 digits"],
      select: false
    }
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (confirmpassword) {
  return await bcrypt.compare(confirmpassword, this.password);
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
