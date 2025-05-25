const express = require('express');
const paymentController = require('../controllers/payment.controller.js');

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/config', paymentController.config);
router.post('/register-payment', paymentController.registerPayment);


module.exports = router;