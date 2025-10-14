import { useEffect, useState } from "react";
import "../style/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(currentUser);

      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      setOrders(allOrders[currentUser] || []);
    }
  }, []);

  if (!user) {
    return <p className="not-logged">Вы не вошли в аккаунт</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">👤 Профиль</h2>
      <p className="profile-email">Ваш email: <b>{user}</b></p>

      <h3 className="profile-subtitle">📦 История заказов</h3>
      {orders.length === 0 ? (
        <p className="no-orders">У вас пока нет заказов.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <p><b>Дата заказа:</b> {order.date}</p>
              <p><b>ФИО:</b> {order.fullName}</p>
              <p><b>Адрес:</b> {order.address}</p>
              <p><b>Телефон:</b> {order.phone}</p>
              <p className="order-total">Сумма: ${order.total}</p>

              <h4>Товары:</h4>
              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i} className="order-item">
                    <img src={item.img} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="status-paid">Статус: Оплачен</p>
              <p className="status-delivery">🚚 Доставка: в пути (1–2 дня)</p>
            </div>
          ))}
        </div>
      )}

      <div className="go-cart">
        <a href="/cart" className="btn">Перейти в корзину</a>
      </div>
    </div>
  );
}

export default Profile;