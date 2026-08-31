{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const Stripe = require("stripe");\
\
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\
\
module.exports = async function handler(req, res) \{\
  if (req.method !== "POST") \{\
    return res.status(405).send("Method not allowed");\
  \}\
\
  const signature = req.headers["stripe-signature"];\
\
  let event;\
\
  try \{\
    event = stripe.webhooks.constructEvent(\
      req.body,\
      signature,\
      process.env.STRIPE_WEBHOOK_SECRET\
    );\
  \} catch (err) \{\
    console.error("Webhook signature verification failed:", err.message);\
\
    return res.status(400).send("Invalid signature");\
  \}\
\
  if (event.type === "checkout.session.completed") \{\
    const session = event.data.object;\
\
    console.log("Payment completed:", session.id);\
\
    /*\
      TODO:\
      Generate a license key and save it to your database.\
    */\
  \}\
\
  return res.status(200).json(\{\
    received: true\
  \});\
\};}