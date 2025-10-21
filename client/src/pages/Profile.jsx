import { useEffect, useState } from "react";
import "../style/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(currentUser);
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = async () => {
    try {
      // Используем фиксированный userId, как в корзине
      const userId = "68f10b0e1cd3b39074630ad9";
      
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      
      if (response.ok) {
        const ordersData = await response.json();
        console.log("Полученные заказы:", ordersData);
        setOrders(ordersData);
      } else {
        console.error("Ошибка при загрузке заказов");
      }
    } catch (error) {
      console.error("Ошибка подключения:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': '⏳ Ожидает обработки',
      'processing': '🔄 В обработке',
      'shipped': '🚚 Отправлен',
      'delivered': '✅ Доставлен',
      'cancelled': '❌ Отменен'
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return (
      <div className="profile-container">
        <p className="not-logged">Вы не вошли в аккаунт</p>
        <div className="profile-actions">
          <a href="/login" className="btn btn-primary">Войти в аккаунт</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Загрузка заказов...</div>
      </div>
    );
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
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h4>Заказ #{order.orderNumber}</h4>
                <span className={`status status-${order.status}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="order-info">
                <p><b>Дата заказа:</b> {formatDate(order.createdAt)}</p>
                <p><b>Получатель:</b> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                <p><b>Адрес:</b> {order.shippingAddress?.address}</p>
                <p><b>Телефон:</b> {order.shippingAddress?.phone}</p>
                <p className="order-total"><b>Сумма заказа:</b> ${order.totalAmount}</p>
              </div>

              <div className="order-items-section">
                <h5>Товары:</h5>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-quantity">× {item.quantity}</span>
                        <span className="item-price">${item.price}</span>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <p className="payment-status">
                  <b>Оплата:</b> {order.paymentStatus === 'paid' ? '✅ Оплачено' : '⏳ Ожидает оплаты'}
                </p>
                {order.status === 'shipped' && (
                  <p className="delivery-info">🚚 Доставка: в пути (1–2 дня)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="profile-actions">
        <a href="/cart" className="btn btn-primary">Перейти в корзину</a>
        <button onClick={fetchUserOrders} className="btn btn-secondary">
          Обновить историю заказов
        </button>
      </div>
    </div>
  );
}

export default Profile;