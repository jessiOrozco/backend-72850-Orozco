import CartModel from "../model/cartModel.js";
import mongoose from "mongoose";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carrito de compras");
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito", error);
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);

            // Buscar producto existente en el carrito
            const existeProducto = carrito.products.find(
                (item) => item.product._id?.toString() === String(productId)
            );


            if (existeProducto) {
                // Incrementar cantidad si ya existe
                existeProducto.quantity += quantity;
            } else {
                // Agregar nuevo producto
                carrito.products.push({
                    product: new mongoose.Types.ObjectId(productId), // Asegúrate de usar ObjectId
                    quantity,
                });
            }

            // Limpia duplicados antes de guardar
            carrito.products = carrito.products.reduce((acc, current) => {
                const existing = acc.find(
                    (item) => item.product._id?.toString() === current.product._id?.toString()
                );

                if (existing) {
                    existing.quantity += current.quantity;
                } else {
                    acc.push(current);
                }

                return acc;
            }, []);



            // Marca como modificado y guarda
            carrito.markModified('products');
            await carrito.save({ validateModifiedOnly: true });

            return carrito;
        } catch (error) {
            console.log('Error al agregar un producto', error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            //cart.products = cart.products.filter(item => item.product.toString() !== productId);
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }


    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }
}

export default CartManager;