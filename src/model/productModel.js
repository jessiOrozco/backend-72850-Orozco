const {Schema, model} = require("mongoose")
const productSchema = new Schema({
    title: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    image: String,
    id: String,
    quantity: Number
}, {versionKey: false})
const Product =model("Product", productSchema, "productos");

module.exports = {
    Product,
    productSchema
}