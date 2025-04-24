module.exports = (sequelize, Sequelize) => {
    const CartDetails = sequelize.define("CartDetails", {
        id_detallescarrito: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_DETALLES_CARRITO"
        },
        id_carrito: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_CARRITO"
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
            field: "PRECIO_UNITARIO"
        },
        fecha_agregado: {
            type: Sequelize.DATE,
            field: "FECHA_AGREGADO",
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: "DETALLES_CARRITO",
        timestamps: false
    });

    return CartDetails;
};
