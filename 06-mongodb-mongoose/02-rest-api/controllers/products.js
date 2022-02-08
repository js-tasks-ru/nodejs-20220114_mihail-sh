const Product = require('../models/Product');
const mongoose = require('mongoose');
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  const products = await Product.find({ subcategory: subcategory });

  ctx.body = { products: products };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products: products };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = 'Невалидный идентификатор';
  } else {
    const product = await Product.findById(id);
    if (product) {
      ctx.body = { product: product };
    } else {
      ctx.status = 404;
      ctx.body = 'Продукт не найден';
    }
  }
};

