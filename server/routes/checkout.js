import express from 'express';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();
// Тестовый процесс оплаты
router.post('/test-payment', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    // Находим корзину пользователя
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }
    
    // Создаем заказ со статусом "оплачено"
    const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        productName: item.product.name // Сохраняем название для истории
      })),
      totalAmount: cart.totalAmount,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'test',
      paymentIntentId: 'test_payment_' + Date.now(),
      shippingAddress: shippingAddress || {
        firstName: 'Test',
        lastName: 'User',
        address: 'Test Address',
        city: 'Test City',
        postalCode: '123456',
        country: 'Test Country'
      }
    });
    
    await order.save();
    
    // Очищаем корзину
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    // Возвращаем созданный заказ
    const populatedOrder = await Order.findById(order._id).populate('items.product');
    
    res.json({
      success: true,
      message: 'Тестовый платеж успешно завершен! Заказ создан.',
      order: populatedOrder
    });
    
  } catch (error) {
    console.error('Ошибка при тестовой оплате:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при обработке заказа: ' + error.message 
    });
  }
});

// Получить историю заказов пользователя
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить детали заказа
router.get('/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user.id 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;