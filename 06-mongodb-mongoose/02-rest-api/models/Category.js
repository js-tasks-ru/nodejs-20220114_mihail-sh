const mongoose = require('mongoose');
const connection = require('../libs/connection');

mongoose.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: (doc, transformed) => {
    delete transformed._id;
  },
});

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
})/*.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; },
})*/;

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
})/*.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; },
})*/;

module.exports = connection.model('Category', categorySchema);
