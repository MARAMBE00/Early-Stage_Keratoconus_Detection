import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: function () { return this.role === 'it'; }}, // Password required only for IT
  role: { type: String, required: true, enum: ['it', 'doctor', 'topographer'] },
});

const User = mongoose.model('User', userSchema);

export default User;
