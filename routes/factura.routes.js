// En factura.routes.js o similar
const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

router.get('/:id_pago/download', facturaController.descargarFactura);

module.exports = router;
