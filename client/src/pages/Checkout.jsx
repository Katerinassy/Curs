import { useState, useEffect } from "react";

function Checkout() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const handlePay = () => {
    if (cart.length === 0) {
      alert("Ваша корзина пуста!");
      return;
    }
    alert("Оплата прошла успешно! 🎉");
    localStorage.removeItem("cart"); // очищаем корзину
    window.location.href = "/profile";
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Оплата заказа</h2>
      <p>Вы оплачиваете свои украшения</p>
      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <h3>Ваш заказ:</h3>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          cart.map(item => (
            <p key={item._id + (item.size || "")}>
              {item.name}{item.size ? ` (Размер ${item.size})` : ""} - ${item.price}
            </p>
          ))
        )}
      </div>
      <button
        onClick={handlePay}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Оплатить
      </button>
    </div>
  );
}

export default Checkout;
