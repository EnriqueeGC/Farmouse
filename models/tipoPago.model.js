module.exports = (sequelize, Sequelize) => {
    const TipoPago = sequelize.define("TipoPago", {
        id_tipo_pago: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_TIPO_PAGO"
        },
        descripcion: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: "DESCRIPCION"
        }
    }, {
        tableName: "TIPO_PAGO",
        timestamps: false
    });

    return TipoPago;
};
