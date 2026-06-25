import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// POST route for creating checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body; // items = [{name, price, quantity}]

    if (!items || !items.length) {
      return res.status(400).json({ error: "No items to checkout" });
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: "pkr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // price in paisa (PKR)
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/marketplace?payment=success`,
      cancel_url: `${FRONTEND_URL}/cart?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;

