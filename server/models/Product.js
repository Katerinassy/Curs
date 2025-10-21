import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String
});

const Product = mongoose.model('Product', productSchema);
export { Product };