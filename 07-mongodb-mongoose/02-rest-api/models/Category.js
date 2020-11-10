const mongoose = require('mongoose');
const connection = require('../libs/connection');
const transformResponce = require('./helpers');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform: transformResponce
  }
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, {
  toJSON: {
    transform: transformResponce
  }
});

module.exports = connection.model('Category', categorySchema);
