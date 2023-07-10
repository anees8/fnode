const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name must be required'],
    unique:  [true, 'Product Name Already Exists'],
    minLength: [2, "Product Name should have minimum 2 letter"],
    maxLength: [50, "Product Name should have maximum 50 letter"],
  },
  price: {
    type: Number,
    required: [true, 'Price must be required'],
  },
  description: {
    type: String,
    required: [true, 'Description must be required'],
  },
  category: {
    required: [true, "Category is required."],
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
   
  },

  images: [
    {
      type: String,
      required: [true, 'Image must be required'],
    },
  ],
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
