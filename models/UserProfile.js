const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
              },
       
    phone: { type: String ,required:true,},
    profileImage: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String }
    }
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
module.exports = UserProfile;
