const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
      trim: true,  
    type: String,
    required: [true, 'Product Name must be required'],
    unique:  [true, 'Product Name Already Exists'],
    minLength: [2, "Product Name should have minimum 2 letter"],
    maxLength: [20, "Product Name should have maximum 20 letter"],
    uppercase: true,
    },
    description: {
      trim: true, 
    type: String,
    required: [true, 'Description must be required'],
    },
   images: {  
    trim: true, 
      type: String,
      required: [true, 'Image must be required'],
    },
    status: {  
    type: Boolean,
    required: [true, 'Status must be required'],
    default:false,
    },

},{timestamps:true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
