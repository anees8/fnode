const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema= new Schema({

    name:{
        type:String ,
        trim: true, 
        required: [true, 'Name must be required'],

    },    
    email:{
        type: String,
        trim: true, 
        required:  [true, 'Email must be required'],
        lowercase: true,
        unique:  [true, 'Email Address Already Exists'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please Enter Valid Email Address'
          ]
    },
    role: {
        trim: true, 
        type: String,
        default: 'user',
      },
    token:{
        trim: true, 
        type:String,
        default: '',
    },    
    phone:{
        type:String,
        trim: true, 
        required:  [true, 'Phone must be required'],
        minLength: [10, "no should have minimum 10 digits"],
        maxLength: [10, "no should have maximum 10 digits"],
        match: [/\d{10}/, "no should only have digits"]  
    },  
    password:{
        type:String,
        trim: true, 
        required:  [true, 'Password must be required'],
        minLength: [6, "no should have minimum 6 digits"],
        
    },
    profile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
    default: '',
    },
        deleted: {
        type: Boolean,
        default: false,
        },
},{timestamps:true});



    userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
    next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    });  

// // Custom instance method to soft delete a user
//     userSchema.methods.softDelete = function () {
//     this.deleted = true;
//     return this.save();
//     };

//   // Custom static method to get all non-deleted users
//         userSchema.statics.findNonDeleted = function () {
//         return this.find({ deleted: false });
//         };
// userSchema.statics.findSoftDeleted = function () {
// return this.find({ deleted: true });
// };




  
const User = mongoose.model('User',userSchema);
module.exports = User;