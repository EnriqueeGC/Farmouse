const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller.js');

router.get('/', pedidoController.getAllPedidos);

module.exports = router;
