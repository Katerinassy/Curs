import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Сохранение заказа (без оплаты)
router.post("/", auth, async (req, res) => {
  try {
    console.log(`Получен запрос на /checkout в 16:04 EEST 09.10.2025. Заголовки:`, req.headers);
    console.log(`Тело запроса:`, req.body);
    const { date, fullName, address, phone, total, items } = req.body;

    // Валидация данных
    if (!fullName || !address || !phone || !total || !items || items.length === 0) {
      console.log(`Ошибка валидации в 16:04 EEST 09.10.2025: Не все данные предоставлены`, { fullName, address, phone, total, items });
      return res.status(400).json({ error: "Заполните все поля и добавьте товары" });
    }

    console.log(`User ID: ${req.userId}`);

    // Создание нового заказа
    const newOrder = new Order({
      userId: req.userId,
      date,
      fullName,
      address,
      phone,
      total,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity || 1,
      })),
      status: "pending",
    });

    await newOrder.save();
    console.log(`Заказ сохранён в БД. ID: ${newOrder._id} в 16:04 EEST 09.10.2025`);

    res.json({ message: "Заказ сохранён в БД", orderId: newOrder._id });
  } catch (err) {
    console.error(`Ошибка при сохранении заказа в 16:04 EEST 09.10.2025:`, err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

export default router;