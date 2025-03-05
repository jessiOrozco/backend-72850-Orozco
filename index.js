const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const hbs = require ("handlebars");
const handlebars = require('express-handlebars');
const ViewRouter = require("./src/routes/view.router.js");
const productService = require( "./src/public/product.service.js");
const cartRouter = require("./src/routes/cart.route");
const productRouter = require("./src/routes/products.routes");
const mongoose = require("mongoose");
const {Cart} = require("./src/model/cartModel");

const app = express()
const port = 8080
app.set("views", "./src/views")
app.set("view engine", "handlebars")
hbs.registerHelper("json", function (context){
    return JSON.stringify(context)
})

app.engine("handlebars", handlebars.engine());



app.use(express.json())
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/view", ViewRouter)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router()

router.get("/", async (req, res) => {
    const limit = req.query.limit  ? req.query.limit : 10
    const page = req.query.page ? req.query.page : 1
    const query = req.query.query ? req.query.query : null
    const sort =  req.query.sort ? req.query.sort : {}
    const productLimit = await productService.getProductsWithParameters(limit, page, query, sort)
    return res.render("index", {data: productLimit})
})

router.get("/products/:pid", async (req,res) =>{

    const pid = req.params.pid.trim();
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.json({"error": "producto_no_encontrado"})
    }
    const productLimit = await productService.getProductsById(pid)
    return res.render("detail", {data: productLimit})
})

router.get("/carts/:pid", async (req,res) =>{

    const pid = req.params.pid.trim();
    console.log(pid)
    if(!pid) {
        return res.json({"error": "Carrito no encontrado"})

    }
    const cart = await getCartById(pid)
    if (!cart) {
        return res.json({"error": "Carrito no encontrado"})
    }
    return res.render("cart", {data: cart.products})
})

app.use(router)
app.get('/favicon.ico', (req, res) => res.status(204).end());

try {
    mongoose.connect(
        "mongodb+srv://jessiqkaorozcoperez:yVMMaufpIMBWr6n0@backendcoder.rgehm.mongodb.net/?retryWrites=true&w=majority&appName=backendCoder"
    ).then(() => {
        console.log("conectado a mongo")
        app.listen(port, () => {

            console.log(`Inventarios app listening on port ${port}`)
        })
    })

}catch (err){
    console.error(err)
    process.exit(1)
}


async function getCartById(id) {

    return await Cart.findOne({id: parseInt(id)}).populate('products.product').lean().exec();
}
