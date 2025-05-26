const PDFDocument = require('pdfkit');
const db = require('../config/db.config');
const { Factura, Pago, Pedido, User, DetallesPedido, Product } = db;
const sequelize = db.sequelize; // ✅ ESTA LÍNEA es la que faltaba


exports.descargarFactura = async (req, res) => {
    const { id_pago } = req.params;

    try {
        const result = await sequelize.query(`
SELECT 
    f.numero_factura,
    f.fecha_emision,
    f.total,
    u.nombre, 
    u.apellido , 
    u.correo,
    p.id_pedido,
    dp.cantidad,
    dp.precio_unitario,
    pr.nombre as nombre_producto
FROM FACTURAS f
JOIN PAGOS pg ON pg.id_pago = f.id_pago
JOIN PEDIDOS p ON p.id_pedido = pg.id_pedido
JOIN USUARIOS u ON u.id_usuario = p.id_usuario
JOIN DETALLE_PEDIDOS dp ON dp.id_pedido = p.id_pedido
JOIN PRODUCTOS pr ON pr.id_producto = dp.id_producto
WHERE f.id_pago = :id_pago;
`, {
            replacements: { id_pago },
            type: sequelize.QueryTypes.SELECT
        });

        console.log('Primer resultado:', result[0]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        const factura = {
            numero_factura: result[0].NUMERO_FACTURA,
            fecha_emision: new Date(result[0].FECHA_EMISION).toLocaleDateString(),
            total: result[0].TOTAL,
            nombre_usuario: result[0].NOMBRE,
            apellido_usuario: result[0].APELLIDO,
            correo: result[0].CORREO,
        };

        const detallePedido = result.map((item, index) => ({
            index: index + 1,
            nombre_producto: item.NOMBRE_PRODUCTO,
            cantidad: item.CANTIDAD,
            precio_unitario: item.PRECIO_UNITARIO,
        }));
        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', `attachment; filename=factura-${factura.numero_factura}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Factura', { align: 'center' });
        doc.moveDown();
        doc.text(`Factura N°: ${factura.numero_factura}`);
        doc.text(`Fecha: ${new Date(factura.fecha_emision).toLocaleDateString()}`);
        doc.text(`Cliente: ${factura.nombre_usuario} ${factura.apellido_usuario}`);
        doc.text(`Email: ${factura.correo}`);
        doc.moveDown();

        doc.fontSize(14).text('Detalle del Pedido:');
        detallePedido.forEach((d, i) => {
            doc.text(`${i + 1}. ${d.nombre_producto} - Cant: ${d.cantidad} - Precio: $${d.precio_unitario}`);
        });

        doc.moveDown();
        doc.fontSize(16).text(`Total: $${factura.total}`, { align: 'right' });
        doc.end();
    } catch (err) {
        console.error('Error al generar factura PDF:', err);
        res.status(500).json({ message: 'Error al generar la factura' });
    }
};
