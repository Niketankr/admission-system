import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'supersecret_admission_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    let user;
    if (isMongoConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      const found = memoryStore.users.find(u => String(u._id) === String(decoded.id));
      if (found) {
        user = { ...found };
        delete user.password;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found. Token is invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.', error: err.message });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access requires one of the following roles: ${roles.join(', ')}`
      });
    }

    next();
  };
}
