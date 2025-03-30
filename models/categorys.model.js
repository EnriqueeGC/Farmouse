module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("Category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_CATEGORIA",
        },
        nombre: {
            type: Sequelize.STRING,
            field: "NOMBRE",
        },
    }, {
        tableName: "CATEGORIAS",
        timestamps: false,
    });
    return Category;
}