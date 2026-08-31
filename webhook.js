const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIP_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);

    return res.status(400).send("Invalid signature");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Payment completed:", session.id);

    /*
      TODO:
      Generate a license key and save it to your database.
    */
  }

  return res.status(200).json({
    received: true
  });
};
