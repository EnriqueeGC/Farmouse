module.exports = (sequelize, Sequelize) => {
    const Pedido = sequelize.define("Pedido", {
        id_pedido: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_PEDIDO"
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_USUARIO"
        },
        fecha_pedido: {
            type: Sequelize.DATE,
            field: "FECHA_PEDIDO",
            defaultValue: Sequelize.NOW
        },
        estado: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: "ESTADO"
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            field: "TOTAL"
        },
        notas: {
            type: Sequelize.STRING(255),
            field: "NOTAS"
        },
        direccion_envio: {
            type: Sequelize.STRING(255),
            allowNull: false,
            field: "DIRECCION_ENVIO"
        },
    }, {
        tableName: "PEDIDOS",
        timestamps: false
    });

    return Pedido;
};
