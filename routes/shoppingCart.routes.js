const express = require('express');
const shoppingCartController = require('../controllers/shoppinCart.controller.js');

const router = express.Router();

router.post('/', shoppingCartController.addToCart);

module.exports = router;