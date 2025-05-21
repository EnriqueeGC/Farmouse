module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id_usuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_USUARIO",
        },
        nombre: {
            type: Sequelize.STRING,
            field: "NOMBRE",
        },
        correo: {
            type: Sequelize.STRING,
            field: "CORREO",
        },
        apellido: {
            type: Sequelize.STRING,
            field: "APELLIDO",
        },
        direccion: {
            type: Sequelize.STRING,
            field: "DIRECCION",
        },
        telefono: {
            type: Sequelize.STRING,
            field: "TELEFONO",
        },
        nombre_usuario: {
            type: Sequelize.STRING,
            field: "NOMBRE_USUARIO",
        },

        contrasenia: {
            type: Sequelize.STRING,
            field: "CONTRASENIA",
        },
        rol: {
            type: Sequelize.STRING,
            field: "ROL",
        },
        url_imagen: {
            type: Sequelize.STRING,
            field: "URL_IMAGEN",
        },
    }, {
        tableName: "USUARIOS",
        timestamps: false,
    });
    return User;
};