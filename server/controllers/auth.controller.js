import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'supersecret_admission_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      isMainAdmin: !!user.isMainAdmin
    },
    secret,
    { expiresIn }
  );
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
        role: userRole,
        designation: userRole === 'admin' ? 'Staff Administrator' : 'Candidate Student',
        department: 'Undergraduate Admissions',
        isMainAdmin: false
      });

      await user.save();
      const token = generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation,
          department: user.department,
          isMainAdmin: user.isMainAdmin
        }
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
        designation: userRole === 'admin' ? 'Staff Administrator' : 'Candidate Student',
        department: 'Undergraduate Admissions',
        isMainAdmin: false,
        createdAt: new Date().toISOString()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        message: 'User registered successfully.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          designation: newUser.designation,
          department: newUser.department,
          isMainAdmin: newUser.isMainAdmin
        }
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation || (user.role === 'admin' ? 'Administrator' : 'Student'),
          department: user.department || 'Admissions',
          isMainAdmin: !!user.isMainAdmin || user.email === 'director@iem.edu.in' || user.email === 'admin@college.edu'
        }
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation || (user.role === 'admin' ? 'Administrator' : 'Student'),
          department: user.department || 'Admissions',
          isMainAdmin: !!user.isMainAdmin || user.email === 'director@iem.edu.in' || user.email === 'admin@college.edu'
        }
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

// Public list of active institutional administrators for the multi-admin portal sign-in
export async function getAdminPersonas(req, res) {
  try {
    if (isMongoConnected) {
      const admins = await User.find({ role: 'admin' }).select('-password').sort({ isMainAdmin: -1, createdAt: 1 });
      return res.json({
        admins: admins.map(a => ({
          id: a._id,
          name: a.name,
          email: a.email,
          designation: a.designation || 'Administrator',
          department: a.department || 'Central Admissions',
          isMainAdmin: !!a.isMainAdmin || a.email === 'director@iem.edu.in' || a.email === 'admin@college.edu'
        }))
      });
    } else {
      const admins = memoryStore.users.filter(u => u.role === 'admin');
      return res.json({
        admins: admins.map(a => ({
          id: a._id,
          name: a.name,
          email: a.email,
          designation: a.designation || 'Administrator',
          department: a.department || 'Central Admissions',
          isMainAdmin: !!a.isMainAdmin || a.email === 'director@iem.edu.in' || a.email === 'admin@college.edu'
        }))
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch admin personas.', error: err.message });
  }
}

// Protected list of all administrators (Admin only)
export async function getAdminStaff(req, res) {
  try {
    if (isMongoConnected) {
      const admins = await User.find({ role: 'admin' }).select('-password').sort({ isMainAdmin: -1, createdAt: 1 });
      return res.json({ admins });
    } else {
      const admins = memoryStore.users
        .filter(u => u.role === 'admin')
        .map(u => {
          const copy = { ...u };
          delete copy.password;
          return copy;
        });
      return res.json({ admins });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch admin staff.', error: err.message });
  }
}

// Main Admin provisions a new Administrator account
export async function createAdminStaff(req, res) {
  try {
    const isMain =
      req.user.isMainAdmin ||
      req.user.email === 'director@iem.edu.in' ||
      req.user.email === 'admin@college.edu';

    if (!isMain) {
      return res.status(403).json({
        message: 'Access Denied: Only the Main Administrator (Prof. Dr. Satyajit Chakraborty) has permission to provision administrative accounts.'
      });
    }

    const { name, email, password, designation, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, official email address, and temporary password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({ message: 'An administrative account with this email already exists.' });
      }

      const newAdmin = new User({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: 'admin',
        designation: designation ? designation.trim() : 'Admissions Officer',
        department: department ? department.trim() : 'Central Admissions Directorate',
        isMainAdmin: false
      });

      await newAdmin.save();

      return res.status(201).json({
        message: 'New administrator created successfully.',
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          designation: newAdmin.designation,
          department: newAdmin.department,
          isMainAdmin: newAdmin.isMainAdmin,
          createdAt: newAdmin.createdAt
        }
      });
    } else {
      const existing = memoryStore.users.find(u => u.email === cleanEmail);
      if (existing) {
        return res.status(409).json({ message: 'An administrative account with this email already exists.' });
      }

      const newAdmin = {
        _id: `usr_admin_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password: bcrypt.hashSync(password, 10),
        role: 'admin',
        designation: designation ? designation.trim() : 'Admissions Officer',
        department: department ? department.trim() : 'Central Admissions Directorate',
        isMainAdmin: false,
        createdAt: new Date().toISOString()
      };

      memoryStore.users.push(newAdmin);

      return res.status(201).json({
        message: 'New administrator created successfully.',
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          designation: newAdmin.designation,
          department: newAdmin.department,
          isMainAdmin: newAdmin.isMainAdmin,
          createdAt: newAdmin.createdAt
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create administrator.', error: err.message });
  }
}
