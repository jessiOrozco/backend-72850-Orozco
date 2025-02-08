const express = require('express')
const cors = require('cors')
const app = express()
const productsController = require("./src/controllers/products.controller.js")
const cartController = require("./src/controllers/cart.controller")
const port = 8080

app.use(express.json())
app.use(cors())
app.use("/api/products", productsController)
app.use("/api/carts", cartController)


app.listen(port, () => {
  console.log(`Aplicacion escuchando por el puerto ${port}`)
})
