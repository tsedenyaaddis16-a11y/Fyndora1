import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// @route   GET /api/users/saved
// @desc    Get logged in user's saved scholarships from MAMP MySQL
// @access  Private
router.get('/saved', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ss.id as saved_id, ss.scholarship_id, ss.notes, ss.status, ss.saved_at,
              s.title, s.provider, s.destination, s.country, s.education_level, s.funding_type, s.coverage, s.deadline, s.application_url
       FROM saved_scholarships ss
       LEFT JOIN scholarships s ON ss.scholarship_id = s.id
       WHERE ss.user_id = ?
       ORDER BY ss.saved_at DESC`,
      [userId]
    );

    const formatted = rows.map((r) => ({
      scholarshipId: r.scholarship_id,
      notes: r.notes || '',
      status: r.status || 'Interested',
      savedAt: r.saved_at,
      scholarship: {
        id: r.scholarship_id,
        _id: r.scholarship_id,
        title: r.title || 'Scholarship Opportunity',
        provider: r.provider || '',
        destination: r.destination || r.country || 'International',
        educationLevel: r.education_level || 'Undergraduate',
        fundingType: r.funding_type || 'Fully funded',
        coverage: typeof r.coverage === 'string' ? JSON.parse(r.coverage || '[]') : r.coverage || [],
        deadline: r.deadline ? new Date(r.deadline).toISOString().split('T')[0] : null,
        applicationUrl: r.application_url || '',
      },
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/saved/:scholarshipId
// @desc    Save scholarship with personal notes & application status in MAMP
// @access  Private
router.post('/saved/:scholarshipId', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;
    const scholarshipId = parseInt(req.params.scholarshipId, 10);
    const { notes = '', status = 'Interested' } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
      [userId, scholarshipId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE saved_scholarships SET notes = ?, status = ? WHERE id = ?',
        [notes, status, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO saved_scholarships (user_id, scholarship_id, notes, status) VALUES (?, ?, ?, ?)',
        [userId, scholarshipId, notes, status]
      );
    }

    res.json({ message: 'Saved scholarship updated in MAMP database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/saved/:scholarshipId
// @desc    Remove saved scholarship from MAMP
// @access  Private
router.delete('/saved/:scholarshipId', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;
    const scholarshipId = parseInt(req.params.scholarshipId, 10);

    await pool.query(
      'DELETE FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
      [userId, scholarshipId]
    );

    res.json({ message: 'Scholarship removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all registered users from MAMP (Admin only)
// @access  Private / Admin
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const pool = getMampPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, role, age, nationality, country, grade, graduation_year, funding_preference, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
