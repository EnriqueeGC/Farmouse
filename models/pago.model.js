// models/Pago.js
module.exports = (sequelize, Sequelize) => {
    const Pago = sequelize.define('Pago', {
        id_pago: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID_PAGO'
        },
        id_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_PEDIDO'
        },
        metodo: {
            type: Sequelize.STRING, // ejemplo: 'tarjeta', 'contra_entrega'
            allowNull: true,
            field: 'METODO'
        },
        estado: {
            type: Sequelize.STRING, // ejemplo: 'exitoso', 'fallido'
            allowNull: true,
            field: 'ESTADO'
        },
        stripe_id: {
            type: Sequelize.STRING, // opcional, ID del PaymentIntent
            allowNull: true,
            field: 'STRIPE_ID'
        },
        monto: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            field: 'MONTO'
        },
        fecha: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
            field: 'FECHA'
        }
    }, {
        tableName: 'PAGOS',
        timestamps: false,
    });

    return Pago;
};
