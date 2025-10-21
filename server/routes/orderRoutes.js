import express from 'express';
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// Получить все заказы
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новый заказ
router.post('/', async (req, res) => {
  try {
    const { fullName, address, phone, items, total, userId } = req.body;

    console.log('Полученные данные заказа:', req.body);

    // Находим реальные ObjectId товаров по их числовым ID
    const orderItems = [];
    
    for (const item of items) {
      // Ищем товар по числовому ID
      const product = await Product.findOne({ id: item.id });
      
      if (!product) {
        console.warn(`Товар с ID ${item.id} не найден в базе`);
        // Все равно добавляем товар, но без привязки к продукту
        orderItems.push({
          product: null,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price
        });
      } else {
        orderItems.push({
          product: product._id,
          productName: item.name,
          quantity: item.quantity || 1,
          price: item.price
        });
      }
    }

    // Если нет товаров, возвращаем ошибку
    if (orderItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Нет товаров для заказа' 
      });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: total,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'test',
      shippingAddress: {
        firstName: fullName?.split(' ')[0] || 'Имя',
        lastName: fullName?.split(' ').slice(1).join(' ') || 'Фамилия',
        address: address,
        phone: phone,
        city: 'Город не указан',
        country: 'Россия'
      }
    });

    const savedOrder = await order.save();
    
    // Получаем полный заказ с populate
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user')
      .populate('items.product');

    console.log('Заказ успешно сохранен:', {
      orderNumber: populatedOrder.orderNumber,
      total: populatedOrder.totalAmount,
      itemsCount: populatedOrder.items.length
    });

    res.status(201).json({ 
      success: true, 
      message: 'Заказ успешно создан',
      order: populatedOrder 
    });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании заказа: ' + error.message 
    });
  }
});

// Упрощенное создание заказа
router.post('/simple', async (req, res) => {
  try {
    const { fullName, address, phone, items, total, userId } = req.body;

    console.log('Создание упрощенного заказа:', req.body);

    // Создаем заказ без привязки к реальным товарам в базе
    const orderItems = items.map(item => ({
      product: null,
      productName: item.name,
      quantity: item.quantity || 1,
      price: item.price
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: total,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'test',
      shippingAddress: {
        firstName: fullName?.split(' ')[0] || 'Имя',
        lastName: fullName?.split(' ').slice(1).join(' ') || 'Фамилия',
        address: address,
        phone: phone,
        city: 'Город не указан',
        country: 'Россия'
      }
    });

    const savedOrder = await order.save();

    res.status(201).json({ 
      success: true, 
      message: 'Заказ успешно создан',
      order: savedOrder 
    });
  } catch (error) {
    console.error('Ошибка при создании упрощенного заказа:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании заказа: ' + error.message 
    });
  }
});

// Получить заказы пользователя по userId
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    console.log(`Найдено заказов для пользователя ${req.params.userId}:`, orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении заказов: ' + error.message 
    });
  }
});

// Получить заказ по ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;