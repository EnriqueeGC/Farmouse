// models/Venta.js
module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define('Venta', {
        id_venta: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID_VENTA'
        },
        id_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_PEDIDO'
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            field: 'TOTAL'
        },
        fecha: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: true,
            field: 'FECHA'
        }
    }, {
        tableName: 'VENTAS',
        timestamps: false,
    });


    return Venta;
};
