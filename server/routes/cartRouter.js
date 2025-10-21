import express from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();
// Получить корзину пользователя
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить товар в корзину
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    // Проверяем, есть ли товар уже в корзине
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Увеличиваем количество
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Добавляем новый товар
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    // Пересчитываем общую сумму
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить количество товара
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    
    if (quantity <= 0) {
      // Удаляем товар если количество 0 или меньше
      cart.items.pull({ _id: req.params.itemId });
    } else {
      item.quantity = quantity;
    }
    
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить товар из корзины
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    cart.items.pull({ _id: req.params.itemId });
    cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Очистить корзину
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;