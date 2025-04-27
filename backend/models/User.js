// User Schema
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true}
},{
  timestamps:true
});

const User = mongoose.model('User', userSchema); //generate "users"

// module.exports = User;
export default User;