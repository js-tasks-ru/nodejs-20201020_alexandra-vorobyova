const Category = require('../models/Category');
module.exports.categoryList = async function categoryList(ctx, next) {
  const products = await Category.find();

  ctx.body = { categories: products };
  return next();
};
