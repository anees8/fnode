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
    profileImage: { type: String ,default: ''},
    address: {
      street: { type: String, default: '' },
      city: { type: String,default: '' },
      state: { type: String ,default: ''},
      zip: { type: String ,default: ''}
    }
  },
  { timestamps: true }
);



const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
module.exports = UserProfile;
