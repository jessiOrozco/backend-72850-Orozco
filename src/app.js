// import express from "express"
// import handlebars from "express-handlebars";
// import __dirname from "./utils.js"
// import ViewRouter from "./routes/view.router.js";
// import {addProduct,getProducts,deletedProduct, getProductById} from "./public/product.service.js";
//
// const router = express.Router()
//
// const app = express()
// const port = 8080
// app.engine("handlebars", handlebars.engine())
// app.set("views", __dirname + "/views")
// app.set("view engine", "handlebars")
//
//
// app.use("/view", ViewRouter)
//
// router.get("/", (req, res) => {
//     const products = getProducts(0)
//     return res.render("home", { products: products })
// })
//
// app.use(router)
//
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`)
// })
