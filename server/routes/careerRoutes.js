import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

const formatCareerRow = (row) => ({
  id: row.id,
  _id: row.id,
  title: row.title,
  category: row.category,
  description: row.description,
  responsibilities: typeof row.responsibilities === 'string' ? JSON.parse(row.responsibilities || '[]') : row.responsibilities || [],
  skills: typeof row.skills === 'string' ? JSON.parse(row.skills || '[]') : row.skills || [],
  highSchoolSubjects: typeof row.high_school_subjects === 'string' ? JSON.parse(row.high_school_subjects || '[]') : row.high_school_subjects || [],
  universitySubjects: typeof row.university_subjects === 'string' ? JSON.parse(row.university_subjects || '[]') : row.university_subjects || [],
  relatedCareers: typeof row.related_careers === 'string' ? JSON.parse(row.related_careers || '[]') : row.related_careers || [],
  workplaces: typeof row.workplaces === 'string' ? JSON.parse(row.workplaces || '[]') : row.workplaces || [],
  resources: typeof row.resources === 'string' ? JSON.parse(row.resources || '[]') : row.resources || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// @route   GET /api/careers
// @desc    Get all careers with filtering & search from MAMP MySQL
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    const pool = getMampPool();

    let query = 'SELECT * FROM careers WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR skills LIKE ? OR university_subjects LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY title ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await pool.query(query, params);
    res.json(rows.map(formatCareerRow));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/careers/:id
// @desc    Get single career details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pool = getMampPool();
    const id = req.params.id;

    let rows;
    if (!isNaN(id)) {
      [rows] = await pool.query('SELECT * FROM careers WHERE id = ?', [parseInt(id, 10)]);
    } else {
      [rows] = await pool.query('SELECT * FROM careers WHERE title LIKE ? LIMIT 1', [`%${id.replace(/-/g, ' ')}%`]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Career not found in MAMP database' });
    }

    res.json(formatCareerRow(rows[0]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/careers
// @desc    Add new career profile to MAMP
// @access  Private / Admin
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      responsibilities,
      skills,
      highSchoolSubjects,
      universitySubjects,
      relatedCareers,
      workplaces,
      resources,
    } = req.body;

    const pool = getMampPool();
    const [result] = await pool.query(
      `INSERT INTO careers (title, category, description, responsibilities, skills, high_school_subjects, university_subjects, related_careers, workplaces, resources)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        description,
        JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
        JSON.stringify(Array.isArray(skills) ? skills : []),
        JSON.stringify(Array.isArray(highSchoolSubjects) ? highSchoolSubjects : []),
        JSON.stringify(Array.isArray(universitySubjects) ? universitySubjects : []),
        JSON.stringify(Array.isArray(relatedCareers) ? relatedCareers : []),
        JSON.stringify(Array.isArray(workplaces) ? workplaces : []),
        JSON.stringify(Array.isArray(resources) ? resources : []),
      ]
    );

    res.status(201).json({
      id: result.insertId,
      _id: result.insertId,
      ...req.body,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/careers/:id
// @desc    Update career in MAMP
// @access  Private / Admin
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    const id = parseInt(req.params.id, 10);
    const {
      title,
      category,
      description,
      responsibilities,
      skills,
      highSchoolSubjects,
      universitySubjects,
      relatedCareers,
      workplaces,
    } = req.body;

    await pool.query(
      `UPDATE careers
       SET title = ?, category = ?, description = ?, responsibilities = ?, skills = ?, high_school_subjects = ?, university_subjects = ?, related_careers = ?, workplaces = ?
       WHERE id = ?`,
      [
        title,
        category,
        description,
        JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
        JSON.stringify(Array.isArray(skills) ? skills : []),
        JSON.stringify(Array.isArray(highSchoolSubjects) ? highSchoolSubjects : []),
        JSON.stringify(Array.isArray(universitySubjects) ? universitySubjects : []),
        JSON.stringify(Array.isArray(relatedCareers) ? relatedCareers : []),
        JSON.stringify(Array.isArray(workplaces) ? workplaces : []),
        id,
      ]
    );

    res.json({ id, _id: id, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/careers/:id
// @desc    Delete career from MAMP
// @access  Private / Admin
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    await pool.query('DELETE FROM careers WHERE id = ?', [parseInt(req.params.id, 10)]);
    res.json({ message: 'Career deleted successfully from MAMP' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/careers/match
// @desc    Match student answers to careers
// @access  Public
router.post('/match', async (req, res) => {
  try {
    const { categoryScores } = req.body;
    const sorted = Object.entries(categoryScores || {}).sort((a, b) => b[1] - a[1]);
    const topCategories = sorted.slice(0, 3).map(([cat]) => cat);

    const pool = getMampPool();
    const [rows] = await pool.query(
      'SELECT * FROM careers WHERE category IN (?) LIMIT 6',
      [topCategories.length > 0 ? topCategories : ['Technology']]
    );

    res.json({
      topCategories,
      matchedCareers: rows.map(formatCareerRow),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
