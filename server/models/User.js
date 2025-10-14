import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Имя обязательно'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов']
  }
}, { 
  timestamps: true 
});

export default mongoose.model('User', userSchema);