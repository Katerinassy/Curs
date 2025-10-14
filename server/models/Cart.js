import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Один пользователь — одна корзина
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      img: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1, min: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);