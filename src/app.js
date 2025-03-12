import express from "express";
import { create } from "express-handlebars";

import ViewRouter from "./routes/view.router.js";

import cartRouter from "./routes/cart.route.js"
import productRouter from "./routes/products.routes.js";
import mongoose from "mongoose";

const hbs = create({
    helpers:{
        json: (context) => JSON.stringify(context),
    }
})

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", ViewRouter)

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
