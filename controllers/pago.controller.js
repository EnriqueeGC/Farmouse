
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pedido, User, DetallesPedido, Venta, Pago } = require('../config/db.config.js');

/* exports.confirmarPago = async (req, res) => {
    const { id_pedido } = req.body;

    try {
        // Validar el pedido
        const pedido = await Pedido.findByPk(id_pedido);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });

        // Cambiar estado a pagado
        pedido.estado = 'pagado';
        await pedido.save();

        // Crear registro en VENTAS (suponiendo que tienes esa tabla)
        await Venta.create({
            id_pedido: id_pedido,
            total: pedido.total,
            fecha: new Date()
        });

        res.status(200).json({ message: "Pago confirmado y venta registrada" });
    } catch (err) {
        console.error("Error al confirmar el pago:", err);
        res.status(500).json({ message: "Error al confirmar el pago" });
    }
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pedido, Venta, Pago } = require('../config/db.config.js'); */

exports.confirmarPago = async (req, res) => {
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

        // Registrar el pago
        await Pago.create({
            id_pedido: id_pedido,
            metodo: paymentIntent.payment_method_types[0],
            monto: paymentIntent.amount / 100,
            estado: paymentIntent.status,
            stripe_id: paymentIntentId,
            fecha_pago: new Date()
        });

        // Registrar la venta
        await Venta.create({
            id_pedido: id_pedido,
            total: pedido.total,
            fecha: new Date()
        });

        res.status(200).json({ message: "Pago confirmado, registrado y venta creada" });
    } catch (err) {
        console.error("Error al confirmar el pago:", err);
        res.status(500).json({ message: "Error al confirmar el pago" });
    }
};

