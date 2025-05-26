// src/models/slide.model.js
module.exports = (sequelize, Sequelize) => {
  const Slide = sequelize.define("Slide", {
    id_slide: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID_SLIDE", // Nombre real en la tabla
    },
    imagen: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "IMAGEN"
    },
    seccion: {
      type: Sequelize.ENUM("izquierda", "centro", "derecha"),
      allowNull: false,
      field: "SECCION"
    },
    orden: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: "ORDEN"
    }
  }, {
    tableName: "SLIDES",
    timestamps: false
  });

  return Slide;
};
