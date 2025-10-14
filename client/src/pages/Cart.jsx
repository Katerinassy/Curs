import { useEffect, useState } from "react";
import "../style/cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/login";
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!fullName || !address || !phone) {
      alert("Заполните все поля!");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Ошибка: пользователь не найден.");
      return;
    }

    const newOrder = {
      date: new Date().toLocaleString(),
      fullName,
      address,
      phone,
      total,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity || 1,
      })),
    };

    try {
      const response = await fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        const data = await response.json();
        setCart([]);
        localStorage.removeItem("cart");
        alert("Заказ оформлен! Перейдите в профиль, чтобы посмотреть историю.");
        window.location.href = "/profile";
      } else {
        const errorData = await response.json();
        alert(`Ошибка при оформлении заказа: ${errorData.error || 'Неизвестная ошибка'}`);
      }
    } catch (err) {
      alert("Ошибка подключения: " + err.message);
    }
  };

  if (cart.length === 0) {
    return <p className="empty-cart">Ваша корзина пуста</p>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Ваша корзина</h1>

      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.img} alt={item.name} />
            <div className="cart-item-info">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-price">${item.price} x {item.quantity || 1}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="cart-total">Итого: ${total}</h2>

      <form onSubmit={handleCheckout} className="checkout-form">
        <input
          type="text"
          placeholder="ФИО"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="checkout-btn">Оплатить</button>
      </form>

      <p className="delivery-info">🚚 Заказ будет доставлен в течение 1–2 дней</p>
    </div>
  );
}

export default Cart;