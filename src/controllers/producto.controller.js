const express = require('express')
const router = express.Router()
const fs = require('fs')

const productosPath = "./src/data/productos.json"
let productos = JSON.parse(fs.readFileSync(productosPath))

router.get("/",(req,res) => {
  const limit = req.query.limit ? req.query.limit : productos.length
  const limitedArray = productos.slice(0,limit)

  res.json(limitedArray)

})

router.get("/:producto", (req,res) => {
  const productID = req.params.producto
  productos.find(item => item.id == productID)
  res.json(productos.find(item => item.id == productID))
})

router.post("/", (req,res) => {
  const body = req.body
  const elementos = [
    "title",
    "codigo",
    "precio",
    "categoria",
    "cantidad"
  ]

  const error = validateFieldsInBody(body, elementos)
  if (error){
    res.json(error)
    return
  }

  if (!body.status){
    body.status = true
  }
  const id = generarID()
  body.id = id

  productos.push(body)

  saveFile(productosPath, productos)

  res.json({status: "OK", id:id})
})

router.put("/:producto", (req, res) => {
  const productId = req.params.producto;
  const body = req.body;
  if (!productId){
    res.json({"error":"el producto es necesario para actualizar" })
  }

  const elementos = [
    "title",
    'codigo',
    'precio',
    'cantidad',
    'categoria'
  ]

  const error = validateFieldsInBody(body, elementos)

  if(error){
    res.json(error)
    return
  }

  if (!body.status){
    body.status = true
  }

  let producto = productos.find(item => item.id == productId)
  if (!producto){
    res.json({"error": "Producto inexistente"})
    return;
  }

  producto = body
  console.log(producto)
  producto.id = parseInt(productId)
  productos.forEach((item, i) => {
    if (item.id == productId){
      console.log("Entro a la validacion")
      productos[i] = producto
      return
    }
  })
  saveFile(productosPath, productos)
  res.json({"update": "Ok"})
})


router.delete("/:id", (req,res) => {
  const id = req.params.id
  if (!id){
    res.json({"error": "El Id del producto es necesario"})
  }

  const producto = productos.find(item => item.id == id)

  if (!producto){
    res.json({"error": "No existe el producto"})
  }

  productos = productos.filter(item => item.id != id)
  saveFile(productosPath, productos)
  res.json({"delete":"OK", producto: producto})
})


function saveFile(path, productos){
  fs.writeFileSync(path, JSON.stringify(productos, null, 2))
}

function generarID(){
  const sortProducts = productos.sort((a,b) => b.id - a.id)
  if (!sortProducts[0]){
    return 1
  }

  return sortProducts[0].id + 1
}

function validateFieldsInBody(body, elementos){
  let error;
  elementos.forEach(element => {
    if ((!element in body) || body[element] ===""){
      error = {"error": `Falta el campo o no debe ser vacio ${element}`}
      return
    }
  });
  return error;
}

module.exports = router