const express = require("express");
const viewRouter = express.Router();
const socketIo = require('socket.io');
const app = express();
const server = require("http").createServer(app);
const productService = require("../public/product.service.js");
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080",
        method: ["GET", "POST"],
    }
})

viewRouter.get('/', (req, res) => {
    const products = productService.getProducts(0)
    return res.render('realtime', {products})
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('add-product', (data) => {

        productService.addProduct(data)
        io.emit("get-product",productService.getProducts(0))
    });
    socket.on('delete-product', (data) => {

        productService.deletedProduct(data.id)
        io.emit("get-product",productService.getProducts(0))
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


server.listen(8081, () => {
    console.log("socket listening on port 8081")
})

module.exports = viewRouter;