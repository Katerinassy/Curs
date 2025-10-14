import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем обязательные поля
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Все поля обязательны для заполнения' 
      });
    }

    // Проверяем валидность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Некорректный формат email' 
      });
    }

    // Проверяем длину пароля
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Пароль должен содержать минимум 6 символов' 
      });
    }

    // Проверяем есть ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Пользователь с таким email уже зарегистрирован' 
      });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создаем пользователя
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем обязательные поля
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны' 
      });
    }

    // Ищем пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        error: 'Пользователь с таким email не найден' 
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        error: 'Неверный пароль' 
      });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Получение информации о текущем пользователе (опционально)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    res.status(401).json({ error: 'Неверный токен' });
  }
});

// Выход пользователя (опционально)
router.post('/logout', (req, res) => {
  // В JWT выход реализуется на клиенте удалением токена
  res.json({ message: 'Выход выполнен успешно' });
});

export default router;