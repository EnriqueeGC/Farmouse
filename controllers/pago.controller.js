const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pedido, User, DetallesPedido, Venta, Pago, Factura } = require('../config/db.config.js');

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
        const nuevoPago = await Pago.create({
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

        // Generar número de factura único
        const ultimaFactura = await Factura.findOne({
            order: [['id_factura', 'DESC']]
        });

        const numeroSecuencial = ultimaFactura
            ? parseInt(ultimaFactura.numero_factura.split('-')[1]) + 1
            : 1;

        const numeroFactura = `FAC-${new Date().getFullYear()}${numeroSecuencial.toString().padStart(4, '0')}`;

        // Crear factura
        await Factura.create({
            id_pago: nuevoPago.id_pago,
            numero_factura: numeroFactura,
            total: nuevoPago.monto,
            fecha_emision: new Date(),
            estado: 'emitida'
        });

        res.status(200).json({
            message: "Pago confirmado, venta y factura creadas correctamente",
            id_pago: nuevoPago.id_pago,
            numero_factura: numeroFactura,
            factura_url: `https://farmouse.onrender.com/api/factura/${nuevoPago.id_pago}/download`
        });
    } catch (err) {
        console.error("Error al confirmar el pago:", err);
        res.status(500).json({ message: "Error al confirmar el pago" });
    }
};
