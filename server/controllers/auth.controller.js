import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'supersecret_admission_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn });
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role === 'admin' ? 'admin' : 'applicant';

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const user = new User({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: userRole
      });

      await user.save();
      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // In-Memory Fallback
      const existingUser = memoryStore.users.find(u => u.email === cleanEmail);
      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password: bcrypt.hashSync(password, 10),
        role: userRole,
        createdAt: new Date().toISOString()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = generateToken(user);

      return res.json({
        message: 'Login successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // In-Memory Fallback
      const user = memoryStore.users.find(u => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = generateToken(user);

      return res.json({
        message: 'Login successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve profile.', error: err.message });
  }
}
