const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pedido, User, DetallesPedido } = require('../config/db.config.js');

exports.registerPayment = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            telefono,
            direccion,
            correo,
            carrito,
            total,
            notas
        } = req.body;

        // Validaciones básicas
        if (!nombre || !apellido || !telefono || !direccion || !carrito || carrito.length === 0) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Buscar o crear usuario temporalmente (opcional)
        let usuario = await User.findOne({ where: { correo } });

        if (!usuario) {
            usuario = await User.create({
                nombre,
                apellido,
                correo,
                telefono,
                direccion,
                rol: 'cliente' // Asignar rol por defecto
            });
        }

        // Crear pedido
        const nuevoPedido = await Pedido.create({
            id_usuario: usuario.id_usuario,
            direccion_envio: direccion,
            total,
            notas,
            estado: 'pendiente'
        });

        // Crear detalles del pedido
        for (const item of carrito) {
            if (!item.idAlimento || !item.quantity || !item.precio) {
                continue; // Saltar elementos mal formateados
            }

            await DetallesPedido.create({
                id_pedido: nuevoPedido.id_pedido,
                id_producto: item.idAlimento, // nombre del campo según carrito localStorage
                cantidad: item.quantity,
                precio_unitario: item.precio
            });
        }

        res.status(201).json({
            message: 'Pedido creado',
            id_pedido: nuevoPedido.id_pedido,
            total
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({
            message: "Error interno",
            error: error.message
        });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, id_pedido } = req.body;

        // Validar el monto e id_pedido
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!id_pedido) {
            return res.status(400).json({ error: 'Missing id_pedido' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'usd',
            metadata: { id_pedido }, // Añadir id_pedido en los metadatos
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.confirmPayment = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        // Obtener detalles del pago desde Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const id_pedido = paymentIntent.metadata.id_pedido;

        // Validar el pedido
        const pedido = await Pedido.findByPk(id_pedido);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

        // Confirmar estado del pago
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: "El pago aún no se ha completado" });
        }

        // Actualizar estado del pedido
        pedido.estado = 'pagado';
        await pedido.save();

        res.status(200).json({ message: "Pago confirmado y pedido actualizado" });
    } catch (error) {
        console.error("Error al confirmar el pago:", error);
        res.status(500).json({ message: "Error al confirmar el pago" });
    }
};

exports.config = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}