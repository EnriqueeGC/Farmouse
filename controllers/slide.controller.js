// src/controllers/slide.controller.js
const { Slide } = require('../config/db.config');
const { storage } = require('../config/cloudinary.config.js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage });

// Middleware para subir imagen
exports.uploadSlide = upload.single('imagen');

// Crear slide
exports.createSlide = async (req, res) => {
  try {
    const { seccion, orden } = req.body;

    console.log('📦 Archivo recibido:', req.file); // 👈 inspección en consola

    let imagen = null;

    if (req.file?.path) {
      imagen = req.file.path;
    } else if (req.file?.secure_url) {
      imagen = req.file.secure_url;
    } else if (req.file?.url) {
      imagen = req.file.url;
    }

    if (!imagen || !seccion) {
      return res.status(400).json({ message: "Imagen y sección son requeridas." });
    }

    const slide = await Slide.create({
      imagen,
      seccion,
      orden: orden ? parseInt(orden) : 0,
    });

    res.status(201).json({ message: "Slide creado con éxito", data: slide });
  } catch (error) {
    console.error('❌ Error al crear slide:', error.message);
    res.status(500).json({ message: "Error al crear slide", error: error.message });
  }
};

// Obtener todos los slides
exports.getSlides = async (req, res) => {
  try {
    const slides = await Slide.findAll({
      order: [['seccion', 'ASC'], ['orden', 'ASC']],
    });
    res.json({ data: slides });
  } catch (error) {
    console.error('❌ Error al obtener slides:', error.message);
    res.status(500).json({ message: "Error al obtener slides", error: error.message });
  }
};

// Eliminar slide
exports.deleteSlide = async (req, res) => {
  try {
    const { id_slide } = req.params;
    const slide = await Slide.findByPk(id_slide);

    if (!slide) {
      return res.status(404).json({ message: "Slide no encontrado" });
    }

    const publicId = slide.imagen?.split('/').pop().split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await slide.destroy();
    res.json({ message: "Slide eliminado correctamente" });
  } catch (error) {
    console.error('❌ Error al eliminar slide:', error.message);
    res.status(500).json({ message: "Error al eliminar slide", error: error.message });
  }
};
