module.exports = (sequelize, Sequelize) => {
    const Envio = sequelize.define("Envio", {
        id_envio: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_ENVIO"
        },
        id_pedido: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_PEDIDO"
        },
        metodo_envio: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: "METODO_ENVIO"
        },
        estado_envio: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: "ESTADO_ENVIO"
        },
        fecha_envio: {
            type: Sequelize.DATE,
            allowNull: true,
            field: "FECHA_ENVIO"
        }
    }, {
        tableName: "ENVIOS",
        timestamps: false
    });

    return Envio;
};
