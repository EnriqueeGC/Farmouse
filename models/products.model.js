module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Product", {
        id_producto: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_PRODUCTO",
        },
        nombre: {
            type: Sequelize.STRING,
            field: "NOMBRE",
        },
        descripcion: {
            type: Sequelize.STRING,
            field: "DESCRIPCION",
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            field: "PRECIO",
        },
        stock: {
            type: Sequelize.INTEGER,
            field: "STOCK",
        },
        id_subcategoria: {
            type: Sequelize.INTEGER,
            field: "ID_SUBCATEGORIA",
        },
        url_imagen: {
            type: Sequelize.STRING,
            field: "URL_IMAGEN",
        },
    }, {
        tableName: "PRODUCTOS",
        timestamps: false,
    });
    return Product;
}