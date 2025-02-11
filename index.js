// import express from('express')
// const cors = require('cors')
// const app = express()
// const productsController = require("./src/routes/products.routes.js")
// const cartController = require("./src/routes/cart.controller")
// const port = 8080
// import handlebars from "handlebars";
//
// app.use(express.json())
// app.engine("handlebars", handlebars.engine())
// app.set("views", "handlebars")
// app.use(cors())
// app.use("/api/products", productsController)
// app.use("/api/carts", cartController)
//
//
// app.listen(port, () => {
//   console.log(`Aplicacion escuchando por el puerto ${port}`)
// })

const express = require("express")
const handlebars = require ("express-handlebars");
const ViewRouter = require("./src/routes/view.router.js");
const productService = require( "./src/public/product.service.js");
const viewRouter = require("./src/routes/view.router");

const router = express.Router()

const app = express()
const port = 8080
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")


app.use("/view", ViewRouter)

router.get("/", (req, res) => {
    const products = productService.getProducts(0)
    return res.render("index", { products: products })
})

app.use(router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
