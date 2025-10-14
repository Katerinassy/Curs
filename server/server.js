import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";
import Product from "./models/Product.js";

dotenv.config();
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API маршруты
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Тестовое заполнение товаров
(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        { name: "Кольцо Сердце", price: 120, image: "/images/love.jpg", description: "Кольцо в форме сердца", category: "Кольца" },
        { name: "Кольцо Классика", price: 150, image: "/images/classika.jpg", description: "Классическое кольцо", category: "Кольца" },
        { name: "Кольцо Вечность", price: 180, image: "/images/vechnost.jpg", description: "Символ вечной любви", category: "Кольца" },
        { name: "Кольцо Звезда", price: 200, image: "/images/star.jpg", description: "Сияние звезды", category: "Кольца" },
        { name: "Кольцо Луна", price: 170, image: "/images/loon.jpg", description: "Кольцо с лунным дизайном", category: "Кольца" },
        { name: "Кольцо Солнце", price: 190, image: "/images/sun.jpg", description: "Яркое солнечное кольцо", category: "Кольца" },
        { name: "Кольцо Цветок", price: 160, image: "/images/flover.jpg", description: "Кольцо с цветочным узором", category: "Кольца" },
        { name: "Кольцо Элегант", price: 220, image: "/images/elegant.jpg", description: "Элегантное кольцо", category: "Кольца" },
        { name: "Кольцо Лебедь", price: 210, image: "/images/lebed.jpg", description: "Кольцо с лебединым дизайном", category: "Кольца" },
        { name: "Кольцо Капля", price: 140, image: "/images/cap.jpg", description: "Кольцо в форме капли", category: "Кольца" },
        { name: "Серьга Звезда", price: 90, image: "/images/s1.jpg", description: "Серьга в форме звезды", category: "Серёжки" },
        { name: "Серьга Луна", price: 95, image: "/images/s5.jpg", description: "Серьга с лунным дизайном", category: "Серёжки" },
        { name: "Серьга Солнце", price: 100, image: "/images/s8.jpg", description: "Яркая солнечная серьга", category: "Серёжки" },
        { name: "Серьга Цветок", price: 110, image: "/images/s6.jpg", description: "Серьга с цветочным узором", category: "Серёжки" },
        { name: "Серьга Сердце", price: 120, image: "/images/s2.jpg", description: "Серьга в форме сердца", category: "Серёжки" },
        { name: "Серьга Лебедь", price: 130, image: "/images/s4.jpg", description: "Серьга с лебединым дизайном", category: "Серёжки" },
        { name: "Серьга Капля", price: 140, image: "/images/s10.jpg", description: "Серьга в форме капли", category: "Серёжки" },
        { name: "Серьга Элегант", price: 150, image: "/images/s9.jpg", description: "Элегантная серьга", category: "Серёжки" },
        { name: "Серьга Вечность", price: 160, image: "/images/s3.jpg", description: "Серьга символизирующая вечность", category: "Серёжки" },
        { name: "Серьга Классика", price: 170, image: "/images/s1.jpg", description: "Классическая серьга", category: "Серёжки" },
        { name: "Браслет Звезда", price: 200, image: "/images/starbraslet.jpg", description: "Браслет с звездным дизайном", category: "Браслеты" },
        { name: "Браслет Луна", price: 210, image: "/images/loonbraslet.jpg", description: "Браслет с лунным узором", category: "Браслеты" },
        { name: "Браслет Солнце", price: 220, image: "/images/sunbraslet.jpg", description: "Яркий солнечный браслет", category: "Браслеты" },
        { name: "Браслет Цветок", price: 230, image: "/images/floverbraslet.jpg", description: "Браслет с цветочным дизайном", category: "Браслеты" },
        { name: "Браслет Сердце", price: 240, image: "/images/lovebraslet.jpg", description: "Браслет в форме сердца", category: "Браслеты" },
        { name: "Браслет Лебедь", price: 250, image: "/images/lebedbraslet.jpg", description: "Браслет с лебединым узором", category: "Браслеты" },
        { name: "Браслет Капля", price: 260, image: "/images/brasletkapla.jpg", description: "Браслет в форме капли", category: "Браслеты" },
        { name: "Браслет Элегант", price: 270, image: "/images/brasletelegat.jpg", description: "Элегантный браслет", category: "Браслеты" },
        { name: "Браслет Вечность", price: 280, image: "/images/brasletvechnost.jpg", description: "Браслет символизирующий вечность", category: "Браслеты" },
        { name: "Браслет Классика", price: 290, image: "/images/brasletclassika.jpg", description: "Классический браслет", category: "Браслеты" },
        { name: "Ожерелье Звезда", price: 300, image: "/images/ostar.jpg", description: "Ожерелье с звездой", category: "Ожерелья" },
        { name: "Ожерелье Луна", price: 310, image: "/images/oloon.jpg", description: "Ожерелье с лунным дизайном", category: "Ожерелья" },
        { name: "Ожерелье Солнце", price: 320, image: "/images/osun.jpg", description: "Яркое солнечное ожерелье", category: "Ожерелья" },
        { name: "Ожерелье Цветок", price: 330, image: "/images/oflover.jpg", description: "Ожерелье с цветочным узором", category: "Ожерелья" },
        { name: "Ожерелье Сердце", price: 340, image: "/images/olove.jpg", description: "Ожерелье в форме сердца", category: "Ожерелья" },
        { name: "Ожерелье Лебедь", price: 350, image: "/images/olebed.jpg", description: "Ожерелье с лебединым дизайном", category: "Ожерелья" },
        { name: "Ожерелье Капля", price: 360, image: "/images/ocapl.jpg", description: "Ожерелье в форме капли", category: "Ожерелья" },
        { name: "Ожерелье Элегант", price: 370, image: "/images/oeleg.jpg", description: "Элегантное ожерелье", category: "Ожерелья" },
        { name: "Ожерелье Вечность", price: 380, image: "/images/ovech.jpg", description: "Ожерелье символизирующее вечность", category: "Ожерелья" },
        { name: "Ожерелье Классика", price: 390, image: "/images/oclass.jpg", description: "Классическое ожерелье", category: "Ожерелья" },
      ];
      await Product.insertMany(products);
      console.log("✅ 40 товаров добавлены в jewelry_store");
    } else {
      console.log("✅ Коллекция products уже содержит данные:", count);
    }
  } catch (err) {
    console.error("❌ Ошибка добавления тестовых товаров:", err.message);
  }
})();

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Сервер запущен на порту ${process.env.PORT || 5000}`);
});