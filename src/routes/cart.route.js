const express = require("express")
const router = express.Router()
const fs = require("fs")

const cartsPath = "./src/data/carrito.json"
let carts = cargaArchivo()

function cargaArchivo(){
  if(fs.existsSync(cartsPath)){
    const carts = fs.readFileSync(cartsPath)
    try {
      return JSON.parse(carts)
    }catch (e){
      return []
    }
  }else {
    return [];
  }
}

router.get("/:cid", (req,res) => {
  const {cid} = req.params;
  cart = carts.find((cart) => cart.id.toString() === cid);
  if(!cart){
    return res.status(404).send("not found cart")
  }
  res.json(cart.products)
})

router.post("/:id/product/:pid", (req,res) => {
  const {id,pid} = req.params;
  const body = req.body
  let cart = carts.find((cart)=> cart.id == id)
  if (!cart){
    return res.status(404).send("not found cart")
  }

  const productos = cart.products;
  let product = productos.find(item => item.id === parseInt(pid))
  if (!product){
    newProduct = {
      "id": parseInt(pid),
      "quantity":body.quantity
    }
    productos.push(newProduct)
  }else{
      product.quantity = product.quantity + body.quantity
  }
  saveFile(cartsPath, carts)
  res.json({cart: cart})
})

router.post("/", (req, res) =>{
  let body = req.body
  if (!body.products){
    body.products = []
  }

  const id = generarID()
  body.id = id

  carts.push(body)
  saveFile(cartsPath,carts)
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
  })
  return sortedCarts[sortedCarts.length -1].id + 1
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