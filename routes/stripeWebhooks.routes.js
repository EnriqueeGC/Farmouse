// routes/webhookRoutes.js
const express = require('express');
const { handlePaymentIntentSucceeded } = require('../controllers/stripeWebhook.contoller'); // Importa el controlador

const router = express.Router();

router.post('/stripe', handlePaymentIntentSucceeded);

module.exports = router;