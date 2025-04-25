// User Schema
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  total: { type: Number, default: 0 },
},{
  timestamps:true
});

const User = mongoose.model('User', userSchema); //generate "users"

// module.exports = User;
export default User;