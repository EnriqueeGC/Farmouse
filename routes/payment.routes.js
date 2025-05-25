const express = require('express');
const paymentController = require('../controllers/payment.controller.js');
const pagoController = require('../controllers/pago.controller.js');

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/config', paymentController.config);
router.post('/register-payment', paymentController.registerPayment);
router.post('/confirm-payment', pagoController.confirmarPago);

module.exports = router;