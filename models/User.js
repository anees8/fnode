const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({

    name:{
        type:String ,
        required: [true, 'Name must be required?'],
    },    
    email:{
        type: String,
        required:  [true, 'Email must be required'],
        lowercase: true,
        unique:  [true, 'Email Address Already Exists'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please Enter Valid Email Address'
          ]
    },
    
    phone:{
        type:String,
        required:  [true, 'Phone must be required'],
        minLength: [10, "Phone should  have minimum 10 digits"],
        maxLength: [10, "Phone should  have maximum 10 digits"],
       match: [/\d{10}/, "Phone should  only have digits"]  
    }, 
    password:{
        type:String ,
        required: [true, 'Password must be required?'],
    }, 
},{timestamps:true});
  
const User = mongoose.model('User',userSchema);
module.exports = User;