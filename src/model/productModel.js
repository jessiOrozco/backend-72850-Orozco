import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    image: String,
    id: String,
    quantity: Number
}, {versionKey: false})
const ProductModel = mongoose.model("productos", productSchema);

export default ProductModel;