const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: false,
    min: 0
  }
}, {
  timestamps: false
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food; 