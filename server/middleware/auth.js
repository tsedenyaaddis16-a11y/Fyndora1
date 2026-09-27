import jwt from 'jsonwebtoken';
import { getMampPool } from '../config/mampDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token required' });
  }

  // Gracefully support demo tokens for offline/sandbox testing
  if (token.startsWith('demo_token')) {
    try {
      const pool = getMampPool();
      const [rows] = await pool.query(
        "SELECT id, name, email, role, age, nationality, country, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference, created_at FROM users WHERE role = 'student' LIMIT 1"
      );
      if (rows.length > 0) {
        const u = rows[0];
        req.user = {
          _id: u.id,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          age: u.age,
          nationality: u.nationality,
          country: u.country,
          grade: u.grade,
          graduationYear: u.graduation_year,
          interests: typeof u.interests === 'string' ? JSON.parse(u.interests || '[]') : u.interests || [],
          preferredFields: typeof u.preferred_fields === 'string' ? JSON.parse(u.preferred_fields || '[]') : u.preferred_fields || [],
          preferredCountries: typeof u.preferred_countries === 'string' ? JSON.parse(u.preferred_countries || '[]') : u.preferred_countries || [],
          fundingPreference: u.funding_preference,
          createdAt: u.created_at,
        };
        return next();
      }
    } catch (e) {
      // continue to JWT verification
    }
  }

  try {
    const secret = process.env.JWT_SECRET || 'pathfinder_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const pool = getMampPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, role, age, nationality, country, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found in MAMP database' });
    }

    const u = rows[0];
    req.user = {
      _id: u.id,
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      age: u.age,
      nationality: u.nationality,
      country: u.country,
      grade: u.grade,
      graduationYear: u.graduation_year,
      interests: typeof u.interests === 'string' ? JSON.parse(u.interests || '[]') : u.interests || [],
      preferredFields: typeof u.preferred_fields === 'string' ? JSON.parse(u.preferred_fields || '[]') : u.preferred_fields || [],
      preferredCountries: typeof u.preferred_countries === 'string' ? JSON.parse(u.preferred_countries || '[]') : u.preferred_countries || [],
      fundingPreference: u.funding_preference,
      createdAt: u.created_at,
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  if (token.startsWith('demo_token')) {
    try {
      const pool = getMampPool();
      const [rows] = await pool.query(
        "SELECT id, name, email, role, age, nationality, country, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference, created_at FROM users WHERE role = 'student' LIMIT 1"
      );
      if (rows.length > 0) {
        const u = rows[0];
        req.user = {
          _id: u.id,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          age: u.age,
          nationality: u.nationality,
          country: u.country,
          grade: u.grade,
          graduationYear: u.graduation_year,
          interests: typeof u.interests === 'string' ? JSON.parse(u.interests || '[]') : u.interests || [],
          preferredFields: typeof u.preferred_fields === 'string' ? JSON.parse(u.preferred_fields || '[]') : u.preferred_fields || [],
          preferredCountries: typeof u.preferred_countries === 'string' ? JSON.parse(u.preferred_countries || '[]') : u.preferred_countries || [],
          fundingPreference: u.funding_preference,
          createdAt: u.created_at,
        };
      }
    } catch (e) {
      req.user = null;
    }
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'pathfinder_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const pool = getMampPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, role, age, nationality, country, grade, graduation_year, interests, preferred_fields, preferred_countries, funding_preference, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length > 0) {
      const u = rows[0];
      req.user = {
        _id: u.id,
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        age: u.age,
        nationality: u.nationality,
        country: u.country,
        grade: u.grade,
        graduationYear: u.graduation_year,
        interests: typeof u.interests === 'string' ? JSON.parse(u.interests || '[]') : u.interests || [],
        preferredFields: typeof u.preferred_fields === 'string' ? JSON.parse(u.preferred_fields || '[]') : u.preferred_fields || [],
        preferredCountries: typeof u.preferred_countries === 'string' ? JSON.parse(u.preferred_countries || '[]') : u.preferred_countries || [],
        fundingPreference: u.funding_preference,
        createdAt: u.created_at,
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

