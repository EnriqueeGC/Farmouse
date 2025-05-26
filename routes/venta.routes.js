const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/venta.controller.js");

router.get("/", ventaController.getAllVentas);

module.exports = router;
