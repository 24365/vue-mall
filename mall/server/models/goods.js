const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productNum":Number,
  "productImage": String
});

module.exports = mongoose.model('Good',productSchema);
