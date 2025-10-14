import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Добавь поле имени

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, // добавь это поле
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Регистрация успешна! Теперь войдите.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            Зарегистрироваться
          </button>
        </form>
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;