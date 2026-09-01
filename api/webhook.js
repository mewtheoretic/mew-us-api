const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
const { generateLicenseKey } = require("./generate-key");

const stripe = new Stripe(process.env.STRIP_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  } catch (error) {
    console.error("Webhook verification failed:", error.message);

    return res.status(400).send("Invalid webhook");
  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    console.log("Payment completed:", session.id);

    // Check whether this purchase already has a key.
    const { data: existingLicense } = await supabase
      .from("licenses")
      .select("*")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    // Prevent duplicate keys if Stripe sends the event again.
    if (existingLicense) {
      console.log("License already exists.");

      return res.status(200).json({
        received: true
      });
    }

    const licenseKey = generateLicenseKey();

    const email =
      session.customer_details?.email || null;

    const { error } = await supabase
      .from("licenses")
      .insert({
        license_key: licenseKey,
        customer_email: email,
        stripe_session_id: session.id,
        active: true
      });

    if (error) {
      console.error("Database error:", error);

      return res.status(500).json({
        error: "Failed to create license"
      });
    }

    console.log("Created license:", licenseKey);
  }

  return res.status(200).json({
    received: true
  });
};
