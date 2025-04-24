module.exports = (sequelize, Sequelize) => {
    const ShoppingCart = sequelize.define("ShoppingCart", {
        id_carrito: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_CARRITO"
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: "ID_USUARIO"
        }
    }, {
        tableName: "CARRITO_COMPRAS",
        timestamps: false
    });

    return ShoppingCart;
};
