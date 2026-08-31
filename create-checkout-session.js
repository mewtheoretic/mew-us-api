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
  // CORS\
  res.setHeader(\
    "Access-Control-Allow-Origin",\
    "https://www.mew-us.com"\
  );\
\
  res.setHeader(\
    "Access-Control-Allow-Methods",\
    "POST, OPTIONS"\
  );\
\
  res.setHeader(\
    "Access-Control-Allow-Headers",\
    "Content-Type"\
  );\
\
  // Browser preflight request\
  if (req.method === "OPTIONS") \{\
    return res.status(200).end();\
  \}\
\
  if (req.method !== "POST") \{\
    return res.status(405).json(\{\
      error: "Method not allowed"\
    \});\
  \}\
\
  try \{\
    const session = await stripe.checkout.sessions.create(\{\
      mode: "payment",\
\
      line_items: [\
        \{\
          price: process.env.STRIPE_PRICE_ID,\
          quantity: 1\
        \}\
      ],\
\
      success_url:\
        "https://www.mew-us.com/success.html?session_id=\{CHECKOUT_SESSION_ID\}",\
\
      cancel_url:\
        "https://www.mew-us.com/cancel.html",\
\
      // Ask Stripe Checkout to collect the customer's email.\
      customer_creation: "always"\
    \});\
\
    return res.status(200).json({
      id: session.id,
      url: session.url
    });\
\
  \} catch (error) \{\
    console.error(error);\
\
    return res.status(500).json(\{\
      error: "Unable to create checkout session"\
    \});\
  \}\
\};}
