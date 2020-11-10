const Products = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  
  if (ctx.query.subcategory) {
    const subcategory = ctx.query.subcategory;

    const products = await Products.find({ subcategory });

    ctx.body = { products };

    return;
  }

  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Products.find();
  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  const isValidId = mongoose.Types.ObjectId.isValid(ctx.params.id);
  if (!isValidId) {
    ctx.throw(400, 'invalid id');
  }

  const product = await Products.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, 'Product not found');
  }

  ctx.body = { product };
  return next();
};

