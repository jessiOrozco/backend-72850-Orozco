const express = require("express");
const viewRouter = express.Router();
const socketIo = require('socket.io');
const app = express();
const server = require("http").createServer(app);
const productService = require("../public/product.service.js");
const handlebars = require("express-handlebars");
const hbs = require('handlebars');
app.set("view engine", "handlebars");
app.set("views", "./src/views");
hbs.registerHelper("json", function (content) {
    return JSON.stringify(content);
})
app.engine("handlebars", handlebars.engine());

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080",
        method: ["GET", "POST"],
    }
})

viewRouter.get('/', async (req, res) => {
    const products = await productService.getProducts(0)
    return res.render('realtime', {products})
})
io.on('connection', (socket) => {

    socket.on('add-product', async (data) => {
        const listField = [
            "title",
            "code",
            "price",
            "stock",
            "category"
        ]

        const error = validateFieldsInBody(data, listField)
        if (error){
            io.emit("error-add-product", error)
            return
        }

        await productService.addProduct(data)
        io.emit("get-product", await productService.getProducts(0))
    });

    socket.on('delete-product', async (data) => {
        console.log(data)
        await productService.deleteProduct(data.id)
        io.emit("get-product", await productService.getProducts(0))
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

module.exports = viewRouter;