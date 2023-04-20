const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema= new Schema({

    name:{
        type:String,
        required: [true, 'Name must be required'],
        
    },
    designation:{
        type:String, 
        required: [true, 'Designation must be required'],
    },
    
    email:{
        type:String ,
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
        minLength: [10, "no should have minimum 10 digits"],
        maxLength: [10, "no should have maximum 10 digits"],
        match: [/\d{10}/, "no should only have digits"]  
    },
        
    age:{
        type:Number ,
        required: [true, 'Age must be required'],
    },
},{timestamps:true});

const Employee = mongoose.model('Employee',employeeSchema);
module.exports = Employee;