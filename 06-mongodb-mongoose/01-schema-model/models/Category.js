const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //'Необходимо заполнить поле Подкатегория',
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //'Необходимо заполнить поле Категория',
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
