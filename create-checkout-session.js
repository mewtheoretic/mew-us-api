const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://www.bytetheoretic.com"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],

      success_url:
        "https://www.bytetheoretic.com/success.html?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "https://www.bytetheoretic.com/cancel.html",

      // Ask Stripe Checkout to collect the customer's email.
      customer_creation: "always"
    });

    return res.status(200).json({
      id: session.id,
      url: session.url
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to create checkout session"
    });
  }
};
