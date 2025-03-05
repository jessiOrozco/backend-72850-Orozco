const {Schema, model ,ObjectId} = require("mongoose")
const {productSchema} = require("./productModel")
const cartSchema = new Schema({
    products:[
        {
            product:{
                type: ObjectId,
                ref: "Product",
                _id: false
            },
            quantity: Number
        }
    ],
    id: Number
}, {versionKey: false})
const Cart =model("Cart", cartSchema, "carritos");

module.exports = {Cart}