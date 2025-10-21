
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../style/auth.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Токен отсутствует или недействителен");
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Пароль успешно обновлен! Войдите с новым паролем.");
        setError("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Ошибка при сбросе пароля");
        setMessage("");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка соединения с сервером");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Сброс пароля</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Сбросить пароль</button>
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

export default ResetPassword;
