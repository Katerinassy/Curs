import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-session", auth, async (req, res) => {
  try {
    // берем корзину пользователя (или присылаем items напрямую)
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Корзина пуста" });

    const line_items = cart.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // можно временно сохранить заказ со статусом "pending" до webhook подтверждения
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
