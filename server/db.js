import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Ошибка подключения к MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;