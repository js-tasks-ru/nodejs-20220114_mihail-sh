const mongoose = require('mongoose');
const connection = require('../libs/connection');

mongoose.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (doc, transformed) => {
    delete transformed._id;
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

})/*.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; },
})*/;

module.exports = connection.model('Product', productSchema);
