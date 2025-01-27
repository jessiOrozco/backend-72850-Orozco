const express = require("express")
const router = express.Router()
const fs = require("fs")

const carritoPath = "./src/data/carrito.json"
let carts = JSON.parse(fs.readFileSync(carritoPath))
router.post("/:id/product/:pid", (req,res) => {

  const body = req.body;
  const lista = [
    "Cantidad",
  ]
  const error = validateFieldsInBody(body,lista)
  if (error){
    return res.json(error)
  }

  const id = req.params.id;
  const pid = req.params.pid;

  if (!id || !pid){
    return res.json({"error": "Faltan datos del producto"})
  }

  const cart = carts.find(item => item.id === id);
  if (!cart){
    return res.json({"error": "Carrito no existe"})
  }

  const productos = cart.products;
  let product = productos.find(item => item.id === pid)
  if (!product){
    return res.json({"error": "Producto en el carrito inexistente"})
  }

  if (product.cantidad){
    product.cantidad = product.cantidad + body.cantidad
  }else {
    product.cantidad = body.cantidad
  }
  prodcuts.forEach((item, i) => {
    if (item.id === pid){
      product[i] = product;
      return
    }
  })

  cart.products = product
  saveFile(carritoPath, carts)
  res.json({cart: cart})

})

router.post("/", (req, res) =>{
  console.log(carts)
  const body = req.body
  const elementos = [
    "productos"
  ]

  const error = validateFieldsInBody(body, elementos)
  if (error){
    res.json(error)
    return
  }

  const id = generarID()
  body.productos.id = id

  carts.push(body)
  saveFile(carritoPath,carts)
  res.json({save:"ok", id:id})
})

function saveFile(path, carts){
  fs.writeFileSync(path, JSON.stringify(carts, null, 2))
}

function generarID(){
  if (carts.length === 0){
    return 1
  }
  let sortedCarts
  sortedCarts = carts.sort( a => {
    console.log(a)

  })
  return sortedCarts[sortedCarts.length -1].productos.id + 1
}

function validateFieldsInBody(body, lista){
  let error;
  lista.forEach(element => {
    if(!(element in body ) || body[element]===""){
      error = {"error": `Falta el campo o no debe ser vacio ${element}`}
      return
    }
  })

  return error;
}

module.exports = router