const express = require('express')
const cors = require('cors')
const app = express()
const productoController = require("./src/controllers/producto.controller.js")
const cartController = require("./src/controllers/cart.controller")
const port = 3000

app.use(express.json())
app.use(cors())
app.use("/api/productos", productoController)
app.use("/api/carrito", cartController)


app.listen(port, () => {
  console.log(`Aplicacion escuchando por el puerto ${port}`)
})
