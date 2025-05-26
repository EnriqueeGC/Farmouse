module.exports = (sequelize, Sequelize) => {
    const Factura = sequelize.define("Factura", {
        id_factura: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_FACTURA"
        },
        id_pago: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_PAGO"
        },
        numero_factura: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            field: "NUMERO_FACTURA"
        },
        fecha_emision: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
            field: "FECHA_EMISION"
        },
        total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            field: "TOTAL"
        },
        estado: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: "ESTADO"
        }
    }, {
        tableName: "FACTURAS",
        timestamps: false
    });


    return Factura;
}