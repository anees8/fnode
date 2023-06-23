const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema= new Schema({
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      status: {
        type: Number,
        default: 1
      }
},{timestamps:true});



const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
