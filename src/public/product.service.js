const fs = require("fs")
const pathProduct = "./src/data/products.json"

let products = JSON.parse(fs.readFileSync(pathProduct)) || [];

function initProducts(){
    let productAux = JSON.parse(fs.readFileSync(pathProduct));
    if(!productAux){
        products = []
        return;
    }
    products = productAux
}

function getProducts(limit){
    if(!limit){
        return products
    }
    return products.slice(0,limit);
}

function getProductById(id){
    return products.find(product => product.id === id)
}

function addProduct(product){
    if(!product.status){
        product.status = true;
    }
    const id = generatedId()
    product.id = id
    products.push(product)
    saveProduct(pathProduct, products)
    return id;
}

function saveProduct(path, products){
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
}

function generatedId(){
    const sortedProducts = products.sort((a,b) => a.id - b.id)
    if(!sortedProducts[0]){
        return 1
    }
    return sortedProducts[0].id + 1
}

function deletedProduct(id){
    const product = products.find(product => product.id === id)
    if(!product ){
        return null;
    }
    products = products.filter(product => product.id !== id)
    saveProduct(pathProduct, products)
    return product
}

module.exports = {
    deletedProduct,
    addProduct,
    getProducts,
    getProductById,
}