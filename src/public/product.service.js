import ProductModel from "../model/productModel.js"
import mongoose from "mongoose";

class ProductService {

    async getProductsWithParameters(limit, page, query, sort) {

        const response = {
            status: "success",
            payload: [],
            totalPages: 0,
            prevPage: 0,
            nextPage: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: null,
            nextLink: null
        }

        try {
            if (sort) {
                if (sort === "asc") {
                    sort = {price: 1}
                }
                if (sort === "desc") {
                    sort = {price: -1}
                }
            }
            const filter = query ? {"category": query} : {}

            const totalProducts = await ProductModel.countDocuments()
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
        } catch (error) {
            console.log(error)
            response.status = "error";
            return response
        }


    }

    async getProducts(limit) {

        return await ProductModel.find({}).lean().limit(limit).exec();
    }

    async getProductsById(id) {
        return await ProductModel.findById(new mongoose.Types.ObjectId(id)).lean().exec();
    }

    async addProduct(data) {
        if (!data.status) {
            data.status = true
        }

        const product = new ProductModel(data)

        return await product.save();

    }


    async deleteProduct(id) {
        return await ProductModel.deleteOne({_id: id}).lean().exec()

    }

}
export default ProductService;