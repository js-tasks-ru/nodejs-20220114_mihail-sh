//npm test -- --grep "mongodb-mongoose/schema-model"
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //'Необходимо заполнить поле Название товара',
  },
  description: {
    type: String,
    required: true, //'Необходимо заполнить поле Описание товара',
  },
  price: {
    type: Number,
    required: true, //'Необходимо заполнить поле Цена товара',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true, //'Необходимо заполнить поле Идентификатор категории товара',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true, //'Необходимо заполнить поле Идентификатор подкатегории товара',
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
