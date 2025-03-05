const express = require("express")
const router = express.Router()
const fs = require('fs');
const {Cart} = require("../model/cartModel")
const mongoose = require("mongoose");


router.put("/:cid/products/:pid", async (req, res) => {

  const body = req.body
  const listField = [
    "quantity",
  ]
  const error = validateFieldsInBody(body, listField)
  if (error) {
    res.json(error)
    return
  }

  if (body.quantity === 0) {
    return res.json({"error": "La cantidad debe ser mayor a 0"})
  }
  const cid = req.params.cid
  const pid = req.params.pid
  if (!cid || !pid) {
    return res.json({"error": "Faltan datos para reconocer el producto"})
  }
  const idCard = parseInt(cid)
  const cart = await getCartById(cid)
  if (!cart) {
    return res.json({"error": "Carrito no existe"})
  }
  const productos = cart.products
  if (productos.length === 0) {
    return res.json({"error": "El carrito esta vacio"})
  }
  let indexProduct = productos.findIndex(item => {
    return item.product.toString() == pid
  })
  if (indexProduct === -1) {
    return res.json({"error": "Producto en el carrito no existe"})
  }
  const product = productos[indexProduct]
  product.quantity = product.quantity ? product.quantity + body.quantity : body.quantity


  cart.products[indexProduct] = product
  try {
    await Cart.updateOne({id: idCard}, cart)
    return res.json({cart: cart})
  } catch (error) {
    console.log(error)
    return res.json({"error": "Error al actualizar el carrito"})
  }


})
router.get("/:cid", async (req, res) => {

  const cid = req.params.cid
  const cart = await Cart.findOne({id: cid}).populate('products.product').lean().exec()
  if (!cart) {
    return res.json({"error": "Carrito no encontrado"})
  }

  res.render("cart", {data: cart})
})

router.post("/", async (req, res) => {
  const body = req.body
  const listField = []
  const error = validateFieldsInBody(body, listField)
  if (error) {
    res.json(error)
    return
  }
  try {
    const id = await generateId()
    body.id = id
    const cart = new Cart(body)
    await cart.save()

    return res.json({save: "OK", id: id})
  } catch (error) {
    console.log(error)
    return res.json({"error": "Error al crear el carrito"})
  }

})


router.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  if (!cid || !pid) {
    return res.json({"error": "Faltan datos para reconocer el producto"})
  }
  const cart = await getCartById(cid)
  if (!cart) {
    return res.json({"error": "Carrito no existe"})
  }
  const productos = cart.products
  let productIndex = productos.findIndex(item => {
    return item.product.toString() == pid
  })
  if (productIndex === -1) {
    return res.json({"error": "Producto en el carrito no existe"})
  }
  //productos = productos.filter(item => item.id != pid)
  cart.products.splice(productIndex, 1)

  try {
    await Cart.updateOne({id: cid}, cart)
    return res.json({cart: cart})
  } catch (error) {
    console.log(error)
    return res.json({"error": "Error al eliminar el producto del carrito"})
  }
})

router.put("/:cid", async (req, res) => {
  const cid = req.params.cid
  if (!cid) {
    return res.json({"error": "Faltan datos para reconocer el carrito"})
  }
  const body = req.body
  const listField = [
    "products",
  ]
  const error = validateFieldsInBody(body, listField)
  if (error) {
    res.json(error)
    return
  }
  const productToAdd = body.products;
  if (productToAdd.length === 0) {
    return res.json({"error": "Productos no puede ser vacio"})
  }
  const cart = await getCartById(cid)
  if (!cart) {
    return res.json({"error": "Carrito no existe"})
  }
  cart.products = getProductsToAdd(cart.products, productToAdd)


  try {
    await Cart.updateOne({id: cid}, cart)
    return res.json({cart: cart})
  } catch (error) {
    console.log(error)
    return res.json({"error": "Error al eliminar el producto del carrito"})
  }
})

router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid
  if (!cid) {
    return res.json({"error": "Faltan datos para reconocer el carrito"})
  }

  const cart = await getCartById(cid)
  if (!cart) {
    return res.json({"error": "Carrito no existe"})
  }
  cart.products = []

  try {
    await Cart.updateOne({id: cid}, cart)
    return res.json({cart: cart})
  } catch (error) {
    console.log(error)
    return res.json({"error": "Error al eliminar el producto del carrito"})
  }
})



function getProductsToAdd(productsCart, productsToAdd) {
  let products = []
  productsToAdd.forEach(item => products.push(
      {
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity
      }
  ))
  return products;
}

async function getCartById(id) {

  return await Cart.findOne({id: parseInt(id)}).exec();
}


async function generateId() {
  const lastCart = await Cart.find({}).sort({id: -1}).exec()
  if (lastCart.length === 0) {
    return 1;
  }
  return lastCart[0].id + 1
}

function validateFieldsInBody(body, listFields) {

  let error;
  listFields.forEach(element => {

    if (!(element in body) || body[element] == "") {

      error = {"error": `Falta el campo o no debe ser vacio ${element}`}
      return;
    }

  });
  return error;
}


module.exports = router