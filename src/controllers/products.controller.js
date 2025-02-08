const express = require('express')
const router = express.Router()
const fs = require('fs')

const productsPath = "./src/data/products.json"
let products = JSON.parse(fs.readFileSync(productsPath))


router.get("/",(req,res) => {
  const limit = req.query.limit ? req.query.limit : products.length
  const limitedArray = products.slice(0,limit)
  if(!limitedArray){
    res.status(404).json({"error": "No se encontro producto"})
  }
  res.json(limitedArray)

})

router.get("/:product", (req,res) => {
  const productID = req.params.product
  productsfilter = products.find(item => item.id == productID)
  if (!productsfilter){
    res.status(404).json({"Error": "Producto no encontrado"})
  }
  res.json(products.find(item => item.id == productID))
})

router.post("/", (req,res) => {
  const body = req.body
  const elementos = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ]
  const error = validateFieldsInBody(body, elementos)
  if (error){
    res.status(400).json(error)
  }

  if (!body.status){
    body.status = true
  }
  const id = generarID()
  body.id = id

  products.push(body)

  saveFile(productsPath, products)

  res.json({status: "OK", id:id})
})

router.put("/:producto", (req, res) => {
  const productId = req.params.producto;
  const body = req.body;
  if (!productId){
    res.status(404).json({"error":"el producto es necesario para actualizar" })
  }

  const elementos = [
    "title",
    'code',
    'price',
    'stock',
    'category',
    'description',
  ]

  const error = validateFieldsInBody(body, elementos)

  if(error){
    res.status(400).json(error)
    return
  }

  if (!body.status){
    body.status = true
  }

  let producto = products.find(item => item.id == productId)
  if (!producto){
    res.json({"error": "Producto inexistente"})
    return;
  }

  producto = body
  producto.id = parseInt(productId)
  products.forEach((item, i) => {
    if (item.id == productId){
      products[i] = producto
      return
    }
  })
  saveFile(productsPath, products)
  res.json({"update": "Ok"})
})


router.delete("/:id", (req,res) => {
  const id = req.params.id
  if (!id){
    res.json({"error": "El Id del producto es necesario"})
  }

  const producto = products.find(item => item.id == id)

  if (!producto){
    res.status(404).json({"error": "No existe el producto"})
  }

  products = products.filter(item => item.id != id)
  saveFile(productsPath, products)
  res.json({"delete":"OK", producto: producto})
})


function saveFile(path, products){
  fs.writeFileSync(path, JSON.stringify(products, null, 2))
}

function generarID(){
  const sortProducts = products.sort((a,b) => b.id - a.id)
  if (!sortProducts[0]){
    return 1
  }

  return sortProducts[0].id + 1
}

function validateFieldsInBody(body, elements){
  let error;
  elements.forEach(element => {
    if (!(element in body) || body[element] ===""){
      error = {"error": `Falta el campo o no debe ser vacio ${element}`}
      return error
    }
  });
  return error;
}

module.exports = router