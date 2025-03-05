const express = require('express')
const router = express.Router()
const fs = require('fs')
const productService = require("../public/product.service");
const {Product} = require("../model/productModel");

const productsPath = "./src/data/products.json"
let products = []


router.get("/",async (req,res) => {
  const limit = req.query.limit  ? req.query.limit : 10
  const page = req.query.page ? req.query.page : 1
  const query = req.query.query ? req.query.query : ""
  const sort =  req.query.sort ? req.query.sort : {}
  const productLimit = await productService.getProductsWithParameters(limit, page, query, sort)
  res.json(productLimit)

})

router.get("/:pid", async (req,res) => {
  const pid = req.params.pid
  const product = await productService.getProductsById(pid)

  if (!product){
    return res.json({"error": "producto_no_encontrado"})
  }

  res.json({product})
})

router.post("/", async (req,res) => {
  const body = req.body
  const  listField = [
    "title",
    "code",
    "price",
    "stock",
    "category"
  ]
  const error = validateFieldsInBody(body,listField)
  if (error) {
    res.json(error)
    return
  }
  await productService.addProduct(body)
  res.json({save: "OK"})
})

router.put("/:pid", async (req, res) => {
  const pid = req.params.pid
  const body = req.body
  if (!pid){
    res.json({"error":"id necesario para actualizar"})
  }
  const  listField = [
    "title",
    "code",
    "price",
    "stock",
    "category"
  ]
  const error = validateFieldsInBody(body,listField)
  if (error) {
    res.json(error)
    return
  }
  if (!body.status){
    body.status = true
  }

  let product = productService.getProductsById(pid)
  if (!product){
    res.json({"error":"producto inexistente"})
    return;
  }

  await Product.updateOne({_id: pid}, body).exec()
  res.json({"update":"OK"})
})


router.delete("/:pid", (req,res) => {
  const pid = req.params.pid

  if (!pid){
    res.json({"error":"id necesario para actualizar"})
  }
  const product = productService.deleteProduct(pid)
  if (!product){
    res.json({"error":"producto inexistente"})
    return;
  }
  res.json({"delete":"OK", producto: product})
})

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