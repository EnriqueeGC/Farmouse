// src/routes/slide.routes.js
const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slide.controller.js');

// Crear slide con imagen
router.post('/', slideController.uploadSlide, slideController.createSlide);

// Obtener todos los slides ordenados
router.get('/', slideController.getSlides);

// Eliminar slide por ID
router.delete('/:id_slide', slideController.deleteSlide);

module.exports = router;
