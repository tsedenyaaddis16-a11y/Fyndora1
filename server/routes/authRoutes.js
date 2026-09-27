import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'pathfinder_super_secret_jwt_key_2026';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new student or admin in MAMP database
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      country,
      age,
      grade,
      graduationYear,
      interests,
      preferredCountries,
      preferredFields,
      fundingPreference,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const pool = getMampPool();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'student');

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role, age, nationality, country, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email.toLowerCase().trim(),
        hashedPassword,
        userRole,
        age || 17,
        country || 'Ethiopia',
        country || 'Ethiopia',
        grade || 'Grade 11',
        graduationYear || 2027,
        JSON.stringify(Array.isArray(interests) ? interests : ['Technology']),
        JSON.stringify(Array.isArray(preferredFields) ? preferredFields : ['Computer Science']),
        JSON.stringify(Array.isArray(preferredCountries) ? preferredCountries : ['USA', 'Canada']),
        fundingPreference || 'Fully funded',
      ]
    );

    const token = generateToken({ id: result.insertId, email, name, role: userRole });

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        _id: result.insertId,
        name,
        email,
        role: userRole,
        country: country || 'Ethiopia',
        nationality: country || 'Ethiopia',
        age: age || 17,
        grade: grade || 'Grade 11',
        graduationYear: graduationYear || 2027,
        interests: Array.isArray(interests) ? interests : ['Technology'],
        preferredCountries: Array.isArray(preferredCountries) ? preferredCountries : ['USA'],
        preferredFields: Array.isArray(preferredFields) ? preferredFields : ['Computer Science'],
        fundingPreference: fundingPreference || 'Fully funded',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user against MAMP MySQL & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const pool = getMampPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        nationality: user.nationality,
        age: user.age,
        grade: user.grade,
        graduationYear: user.graduation_year,
        interests: typeof user.interests === 'string' ? JSON.parse(user.interests || '[]') : user.interests || [],
        preferredCountries: typeof user.preferred_countries === 'string' ? JSON.parse(user.preferred_countries || '[]') : user.preferred_countries || [],
        preferredFields: typeof user.preferred_fields === 'string' ? JSON.parse(user.preferred_fields || '[]') : user.preferred_fields || [],
        fundingPreference: user.funding_preference,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
