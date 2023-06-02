const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name must be required'],
    unique:  [true, 'Product Name Already Exists'],
  },
  price: {
    type: String,
    required: [true, 'Price must be required'],
  },
  description: {
    type: String,
    required: [true, 'Description must be required'],
  },
  images: [
    {
      type: String,
      required: [true, 'Image must be required'],
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
