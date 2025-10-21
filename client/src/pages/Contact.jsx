import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../style/contact.css';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_8g7aksq', // твой service ID
        'template_f3ecbw6', // вставь свой template ID
        form.current,
        '58n80SRSfNFwpx2kT' // твой Public Key
      )
      .then(
        () => {
          alert('Сообщение успешно отправлено!');
          form.current.reset();
        },
        (error) => {
          alert('Ошибка: ' + error.text);
        }
      );
  };

  return (
    <div className="contact-container">
      <h1>Свяжитесь с нами</h1>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <label>Имя:</label>
        <input type="text" name="name" placeholder="Ваше имя" required />

        <label>Email:</label>
        <input type="email" name="email" placeholder="Ваш email" required />

        <label>Сообщение:</label>
        <textarea name="message" placeholder="Ваше сообщение" required />

        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Contact;
