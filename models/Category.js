const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Product Name must be required'],
    unique:  [true, 'Product Name Already Exists'],
    minLength: [2, "Product Name should have minimum 2 letter"],
    maxLength: [10, "Product Name should have maximum 10 letter"],
    lowercase: true,
    },
    description: {
    type: String,
    required: [true, 'Description must be required'],
    },
    images:{
    type: String,
    required: [true, 'Image must be required'],
    },
    status: {
    type: Number,
    required: [true, 'Status must be required'],
    default:0,
    },

},{timestamps:true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
