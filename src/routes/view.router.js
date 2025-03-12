import express from "express";
import ProductManager from "../managers/product-manager.js";
import CartManager from "../managers/cart-manager-db.js";
import {Server} from "socket.io";
import http from "http";
const router = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "*",
        method: ["GET","POST"],
    }
});

router.get('/', async (req, res) => {
    const products = await productManager.getProducts(0)
    const nuevoArray = products.docs.map(product => {
        const { _id, ...rest } = product.toObject();
        return rest;
    });
    return res.render('realtime', {products: nuevoArray});
})
io.on('connection', (socket) => {

    socket.on('add-product', async(data) => {
        const listField = [
            "title",
            "code",
            "price",
            "stock",
            "category"
        ]
        console.log("emitieron un add-product");

        const error = validateFieldsInBody(data, listField)
        if (error){
            io.emit("error-add-product", error)
            return
        }

        await productManager.addProduct(data)
        io.emit("get-product", await productManager.getProducts(0))
    });

    socket.on('delete-product', async(data) => {
        await productManager.deleteProduct(data.id)
        io.emit("get-product", await productManager.getProducts(0))
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

function validateFieldsInBody(body, listFields){
    let error;
    listFields.forEach(element => {

        if (!(element in body) || body[element] == ""){

            error =  {"error": `Falta el campo o no debe ser vacio ${element}`}
            return
        }

    });
    return error;
}

server.listen(8081, () => {

})


router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = products.docs.map(product => {

            return product.toObject();
        });

        res.render("index", {
            products: nuevoArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
            quantity: item.quantity
        }));

        res.render("cart", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
        }
        return res.render("detail", {product: product})
    }catch(error){
        console.error("Error al obtener producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

export default router;
