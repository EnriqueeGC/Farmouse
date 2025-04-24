require('dotenv').config();
const { ShoppingCart, CartDetails, Product } = require('../config/db.config.js');

exports.addToCart = async (req, res) => {
    const { id_producto, cantidad, id_usuario } = req.body;

    if (!id_producto || !cantidad || !id_usuario) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    try {
        let carrito = await ShoppingCart.findOne({
            where: { id_usuario }
        });

        if (!carrito) {
            carrito = await ShoppingCart.create({ id_usuario });
            console.log("Carrito creado:", carrito.id_carrito);
        }

        const detalle = await CartDetails.findOne({
            where: {
                id_carrito: carrito.id_carrito, // Corregido: usar id_carrito en lugar de id_detalles_carrito
                id_producto
            }
        });

        if (detalle) {
            detalle.cantidad += parseInt(cantidad, 10);
            await detalle.save();
        } else {
            // Paso 5: Obtener precio actual del producto
            const producto = await Product.findByPk(id_producto);
            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }

            // Validar que haya suficiente stock
            if (producto.stock < cantidad) {
                return res.status(400).json({ 
                    error: "No hay suficiente stock disponible.", 
                    stockDisponible: producto.stock 
                });
            }

            // Paso 6: Agregar nuevo detalle al carrito
            await CartDetails.create({
                id_carrito: carrito.id_carrito,
                id_producto,
                cantidad: parseInt(cantidad, 10),
                precio_unitario: producto.precio
            });

            // Paso 7: Actualizar stock del producto
            producto.stock -= cantidad;
            await producto.save();
        }

        res.status(200).json({ 
            message: "Producto agregado al carrito correctamente.",
            carritoId: carrito.id_carrito,
            
        });

    } catch (error) {
        console.error("Error en addToCart:", error);
        res.status(500).json({ 
            error: "Error al agregar producto al carrito.",
            detalles: error.message 
        });
    }
};

// eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
    const { id_producto, id_usuario } = req.body;

    if (!id_producto || !id_usuario) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    try {
        const carrito = await ShoppingCart.findOne({
            where: { id_usuario }
        });

        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        const detalle = await CartDetails.findOne({
            where: {
                id_carrito: carrito.id_carrito,
                id_producto
            }
        });

        if (!detalle) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito." });
        }

        // Paso 5: Obtener precio actual del producto
        const producto = await Product.findByPk(id_producto);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        // Validar que haya suficiente stock
        if (producto.stock < detalle.cantidad) {
            return res.status(400).json({ 
                error: "No hay suficiente stock disponible.", 
                stockDisponible: producto.stock 
            });
        }

        // Paso 6: Eliminar producto del carrito
        await detalle.destroy();

        // Paso 7: Actualizar stock del producto
        producto.stock += detalle.cantidad;
        await producto.save();

        res.status(200).json({ message: "Producto eliminado del carrito correctamente." });

    } catch (error) {
        console.error("Error en removeFromCart:", error);
        res.status(500).json({ 
            error: "Error al eliminar producto del carrito.",
            detalles: error.message 
         });
    }
};