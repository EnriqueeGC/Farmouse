const db = require("../config/db.config.js");
const Pedido = db.Pedido;
const Detalle = db.DetallesPedido;

exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: Detalle, as: 'detalles' }],
      order: [['fecha_pedido', 'DESC']]
    });

    res.json({ data: pedidos });
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};