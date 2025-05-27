const db = require("../config/db.config.js");
const Pedido = db.Pedido;
const DetallesPedido = db.DetallesPedido; // 👈 exactamente así

exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: DetallesPedido, as: 'detalles' }], // 👈 alias 'detalles' debe coincidir con el de db.config.js
      order: [['fecha_pedido', 'DESC']]
    });

    res.json({ data: pedidos });
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};
