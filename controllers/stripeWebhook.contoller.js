// controllers/stripeWebhookController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { registerPayment } = require('./payment.controller');

// controllers/stripeWebhookController.js
exports.handlePaymentIntentSucceeded = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const id_pedido = paymentIntent.metadata.id_pedido;

    await registerPayment(id_pedido, paymentIntent);
    res.status(200).json({ received: true });
  } else {
    res.status(400).end();
  }
};

