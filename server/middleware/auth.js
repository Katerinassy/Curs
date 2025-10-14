import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("Проверка авторизации. Заголовок:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Нет авторизации" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.userId = decoded.userId;
    console.log("Успешная авторизация. User ID:", req.userId);
    next();
  } catch (err) {
    console.error("Ошибка авторизации:", err.message);
    res.status(401).json({ error: "Недействительный токен" });
  }
};

export default auth;