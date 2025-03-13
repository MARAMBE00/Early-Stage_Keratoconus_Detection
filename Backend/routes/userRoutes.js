import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Ensure an IT admin account exists
const ensureAdminExists = async () => {
  const existingAdmin = await User.findOne({ username: 'IT', role: 'it' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await new User({ username: 'IT', password: hashedPassword, role: 'it' }).save();
    console.log("Default IT admin created!");
  }
};
ensureAdminExists();

// Login Route
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Find user by username and role
    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials or role mismatch" });
    }

    // IT department users have passwords; doctors & topographers do not
    if (role === 'it') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(403).json({ message: "Login not allowed for this role" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
