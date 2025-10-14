// ----------------------
// Импорты библиотек
// ----------------------
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Order from "./models/Order.js";
import authRoutes from "./routes/auth.js";
import checkoutRoutes from "./routes/checkout.js";

// ----------------------
// Инициализация приложения
// ----------------------
dotenv.config();
const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// Подключение MongoDB
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB подключена в 16:04 EEST 09.10.2025`))
  .catch((err) => console.error(`Ошибка подключения MongoDB в 16:04 EEST 09.10.2025:`, err));

mongoose.connection.on("error", (err) => console.error(`MongoDB Error в 16:04 EEST 09.10.2025:`, err));
mongoose.connection.on("connected", () => console.log(`MongoDB Connected! в 16:04 EEST 09.10.2025`));

// ----------------------
// Тестовые данные
// ----------------------
const defaultProducts = [
  {
    name: "Кольцо Сердце",
    price: 120,
    image: "love.jpg",
    description: "Кольцо в форме сердца, серебро 925 пробы, ручная работа",
    category: "Кольца",
  },
  {
    name: "Кольцо Классика",
    price: 150,
    image: "classika.jpg",
    description: "Классическое кольцо из белого золота с бриллиантом",
    category: "Кольца",
  },
  {
    name: "Кольцо Вечность",
    price: 200,
    image: "vechnost.jpg",
    description: "Кольцо Вечность — символ любви и красоты",
    category: "Кольца",
  },
  {
    name: "Серьги Звезда",
    price: 90,
    image: "star.jpg",
    description: "Серьги в форме звезды из серебра",
    category: "Серьги",
  },
  {
    name: "Серьги Луна",
    price: 100,
    image: "loon.jpg",
    description: "Серьги в виде полумесяца, с гравировкой",
    category: "Серьги",
  },
  {
    name: "Колье Солнце",
    price: 220,
    image: "sun.jpg",
    description: "Колье Солнце с позолотой и кристаллами Swarovski",
    category: "Колье",
  },
  {
    name: "Браслет Цветок",
    price: 130,
    image: "flover.jpg",
    description: "Браслет с подвеской в форме цветка",
    category: "Браслеты",
  },
  {
    name: "Колье Элегант",
    price: 180,
    image: "elegant.jpg",
    description: "Элегантное кольцо из белого золота с жемчугом",
    category: "Колье",
  },
  {
    name: "Серьги Утро",
    price: 95,
    image: "morning.jpg",
    description: "Серьги с кристаллами, символизирующие рассвет",
    category: "Серьги",
  },
];

// ----------------------
// Тестовые пользователи
// ----------------------
const createDefaultUsers = async () => [
  {
    name: "Алексей Иванов",
    email: "alex@example.com",
    password: await bcrypt.hash("password123", 10),
  },
  {
    name: "Мария Петрова",
    email: "maria@example.com",
    password: await bcrypt.hash("password123", 10),
  },
];

// ----------------------
// Seed — заполнение базы
// ----------------------
const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    if (productCount === 0 || userCount === 0 || orderCount === 0) {
      console.log(`🧹 Очищаем старые данные в 16:04 EEST 09.10.2025...`);
      await Product.deleteMany({});
      await User.deleteMany({});
      await Order.deleteMany({});

      console.log(`📦 Добавляем тестовые товары в 16:04 EEST 09.10.2025...`);
      const products = await Product.insertMany(defaultProducts);

      console.log(`👤 Добавляем пользователей в 16:04 EEST 09.10.2025...`);
      const defaultUsers = await createDefaultUsers();
      const users = await User.insertMany(defaultUsers);

      console.log(`🧾 Добавляем тестовый заказ в 16:04 EEST 09.10.2025...`);
      await Order.insertMany([
        {
          userId: users[0]._id,
          date: new Date().toLocaleString(),
          items: [
            { name: "Кольцо Сердце", price: 120, img: "love.jpg", quantity: 1 },
          ],
          total: 120,
          status: "pending",
          fullName: "Алексей Иванов",
          address: "г. Москва, ул. Примерная, д. 10",
          phone: "+79991234567",
        },
      ]);

      console.log(`✅ База успешно заполнена тестовыми данными в 16:04 EEST 09.10.2025!`);
    } else {
      console.log(`ℹ️ Данные уже есть, seed пропущен в 16:04 EEST 09.10.2025`);
    }
  } catch (err) {
    console.error(`Ошибка при заполнении базы в 16:04 EEST 09.10.2025:`, err);
  }
};

// ----------------------
// Запускаем seed после подключения
// ----------------------
mongoose.connection.once("open", seedDatabase);

// ----------------------
// Stripe и оплата
// ----------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------
// Основные маршруты API
// ----------------------

// Проверка статуса сервера
app.get("/", (req, res) => {
  res.send("🚀 Сервер работает и подключён к базе данных в 16:04 EEST 09.10.2025!");
});

// Получить все товары
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении товаров", error: err.message });
  }
});

// Получить всех пользователей
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении пользователей", error: err.message });
  }
});

// Получить все заказы
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении заказов", error: err.message });
  }
});

// ----------------------
// Регистрация и авторизация
// ----------------------
app.use("/auth", authRoutes);

// ----------------------
// Stripe Checkout (оставляем как заглушку)
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;
    res.json({ message: "Stripe временно не используется" });
  } catch (err) {
    console.error(`Ошибка Stripe в 16:04 EEST 09.10.2025:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Подключаем checkout маршруты
// ----------------------
app.use("/checkout", checkoutRoutes);

// ----------------------
// Запуск сервера
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT} в 16:04 EEST 09.10.2025`);
});