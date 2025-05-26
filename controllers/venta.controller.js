const db = require("../config/db.config.js");
const Venta = db.Venta;
const Pedido = db.Pedido;

exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        {
          model: Pedido,
          as: "pedido"
        }
      ],
      order: [["fecha", "DESC"]]
    });

    res.json({ data: ventas });
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};
