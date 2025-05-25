module.exports = (sequelize, Sequelize) => {
    const DetallePedido = sequelize.define("DetallePedido", {
        id_detalle: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_DETALLE"
        },
        id_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_PEDIDO"
        },
        id_producto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_PRODUCTO"
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "CANTIDAD"
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            field: "PRECIO_UNITARIO"
        }
    }, {
        tableName: "DETALLE_PEDIDOS",
        timestamps: false
    });

    return DetallePedido;
};
