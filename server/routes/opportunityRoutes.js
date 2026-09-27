import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

const formatOpportunityRow = (row) => ({
  id: row.id,
  _id: row.id,
  title: row.title,
  provider: row.provider,
  type: row.type,
  description: row.description,
  country: row.country,
  eligibility: row.eligibility,
  deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : null,
  funding: row.funding,
  applicationUrl: row.application_url,
  officialWebsite: row.official_website,
  verified: Boolean(row.verified),
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// @route   GET /api/opportunities
// @desc    Get all opportunities from MAMP MySQL
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    const pool = getMampPool();

    let query = "SELECT * FROM opportunities WHERE status = 'active'";
    const params = [];

    if (type && type !== 'All') {
      query += ' AND type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND (title LIKE ? OR provider LIKE ? OR description LIKE ? OR country LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY deadline ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows.map(formatOpportunityRow));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/opportunities/:id
// @desc    Get single opportunity
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pool = getMampPool();
    const id = req.params.id;

    let rows;
    if (!isNaN(id)) {
      [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [parseInt(id, 10)]);
    } else {
      [rows] = await pool.query('SELECT * FROM opportunities WHERE title LIKE ? LIMIT 1', [`%${id.replace(/-/g, ' ')}%`]);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(formatOpportunityRow(rows[0]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/opportunities
// @desc    Add opportunity to MAMP
// @access  Private / Admin
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { title, provider, type, description, country, eligibility, deadline, funding, applicationUrl, officialWebsite } = req.body;
    const pool = getMampPool();

    const [result] = await pool.query(
      `INSERT INTO opportunities (title, provider, type, description, country, eligibility, deadline, funding, application_url, official_website, verified, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active')`,
      [
        title,
        provider,
        type,
        description,
        country || 'Global',
        eligibility || '',
        deadline || null,
        funding || '',
        applicationUrl || '',
        officialWebsite || '',
      ]
    );

    res.status(201).json({ id: result.insertId, _id: result.insertId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/opportunities/:id
// @desc    Update opportunity in MAMP
// @access  Private / Admin
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    const id = parseInt(req.params.id, 10);
    const { title, provider, type, description, country, eligibility, deadline, funding, applicationUrl, officialWebsite } = req.body;

    await pool.query(
      `UPDATE opportunities
       SET title = ?, provider = ?, type = ?, description = ?, country = ?, eligibility = ?, deadline = ?, funding = ?, application_url = ?, official_website = ?
       WHERE id = ?`,
      [title, provider, type, description, country, eligibility, deadline || null, funding, applicationUrl, officialWebsite, id]
    );

    res.json({ id, _id: id, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/opportunities/:id
// @desc    Delete opportunity from MAMP
// @access  Private / Admin
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    await pool.query('DELETE FROM opportunities WHERE id = ?', [parseInt(req.params.id, 10)]);
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
