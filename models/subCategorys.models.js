module.exports = (sequelize, Sequelize) => {
    const SubCategory = sequelize.define("SubCategory", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_SUBCATEGORIA",
        },
        nombre: {
            type: Sequelize.STRING,
            field: "NOMBRE",
        },
        id_categoria: {
            type: Sequelize.INTEGER,
            field: "ID_CATEGORIA",
        }
    }, {
        tableName: "SUBCATEGORIAS",
        timestamps: false,
    });
    return SubCategory;
}