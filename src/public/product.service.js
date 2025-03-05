const fs = require("fs")
const pathProduct = "./src/data/products.json"

const {Product} = require("../model/productModel")
const mongoose = require("mongoose");

async function getProductsWithParameters(limit, page, query,sort){

    const response ={
        status: "success",
        payload: [],
        totalPages : 0,
        prevPage : 0,
        nextPage : 0,
        hasPrevPage : false,
        hasNextPage : false,
        prevLink : null,
        nextLink : null
    }

    try {
        if (sort){
            if (sort === "asc"){
                sort ={price: 1}
            }
            if(sort === "desc"){
                sort = {price: -1}
            }
        }
        const filter = query ? {"category": query} : {}

        const totalProducts = await Product.countDocuments()
        const totalPages = Math.ceil(totalProducts / limit)
        const numberPage = parseInt(page);
        response.totalPages = totalPages
        const prevPage = numberPage > 1 && totalPages !== 0 ? numberPage - 1 : null
        const nextPage = numberPage < response.totalPages ? numberPage + 1 : null
        response.prevPage = prevPage
        response.nextPage = nextPage
        response.hasPrevPage = !!prevPage
        response.hasNextPage = !!nextPage
        response.prevLink = prevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}` : null
        response.nextLink = nextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}` : null
        response.payload = await Product.find(filter).lean().limit(limit).skip((page - 1) * limit).sort(sort).exec()
        return response;
    }catch (error) {
        console.log(error)
        response.status = "error";
        return response
    }



}
async function getProducts(limit){

    products = await Product.find({}).lean().limit(limit).exec()
    return products;
}
async function getProductsById(id){
    return await Product.findById(new mongoose.Types.ObjectId(id)).lean().exec();
}
async function addProduct(data){
    if (!data.status){
        data.status = true
    }

    const product = new Product(data)

    return await product.save();

}




async function deleteProduct(id){
    return await Product.deleteOne({_id: id}).lean().exec()

}
module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    deleteProduct,
    getProductsWithParameters
}