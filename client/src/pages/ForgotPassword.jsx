
import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log("Отправка запроса на сброс пароля для:", email);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Ответ сервера:", response);
      const data = await response.json();
      console.log("Данные ответа:", data);

      if (response.ok) {
        setMessage("Ссылка для сброса пароля отправлена на ваш email!");
        setError("");
        setEmail("");
      } else {
        setError(data.error || "Ошибка при запросе сброса пароля");
        setMessage("");
      }
    } catch (error) {
      console.error("Ошибка соединения:", error.message);
      setError("Ошибка соединения с сервером");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Восстановление пароля</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn">Отправить ссылку для сброса</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p>
          Вернуться к <Link to="/login">входу</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
