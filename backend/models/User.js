// User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},{
  timestamps:true
});

const User = mongoose.model('User', userSchema); //generate "users"

module.exports = User;
// export default User;