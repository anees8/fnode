const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema= new Schema({

    name:{
        type:String,
        required: [true, 'Name must be required'],
        unique:  [true, 'Role Already Exists'],
    },
    status: {
      type: Number,
      default: 1
    }
},{timestamps:true});



const Role = mongoose.model('Role',roleSchema);
module.exports = Role;