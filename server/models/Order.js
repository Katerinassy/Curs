import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
