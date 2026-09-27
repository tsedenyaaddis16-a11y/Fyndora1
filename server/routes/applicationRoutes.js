import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const formatApplicationRow = (row) => ({
  id: row.id,
  _id: row.id,
  userId: row.user_id,
  scholarshipId: row.scholarship_id,
  scholarshipTitle: row.scholarship_title,
  status: row.status,
  deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : null,
  dateApplied: row.date_applied ? new Date(row.date_applied).toISOString().split('T')[0] : null,
  notes: row.notes,
  checklist: typeof row.checklist === 'string' ? JSON.parse(row.checklist || '[]') : row.checklist || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// @route   GET /api/applications
// @desc    Get all applications for logged in student from MAMP
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM applications WHERE user_id = ? ORDER BY deadline ASC',
      [userId]
    );

    res.json(rows.map(formatApplicationRow));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/applications
// @desc    Create a new tracked application in MAMP
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;
    const { scholarshipId, scholarshipTitle, status, deadline, dateApplied, notes, checklist } = req.body;

    const defaultChecklist = [
      { text: 'High School Official Transcripts', completed: false },
      { text: 'Teacher Recommendation Letters (2)', completed: false },
      { text: 'Personal Statement / Essay', completed: false },
      { text: 'Language Proficiency Certificate', completed: false },
      { text: 'Final Portal Submission', completed: false },
    ];

    const [result] = await pool.query(
      `INSERT INTO applications (user_id, scholarship_id, scholarship_title, status, deadline, date_applied, notes, checklist)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        scholarshipId ? parseInt(scholarshipId, 10) : null,
        scholarshipTitle || 'Scholarship Application',
        status || 'Preparing',
        deadline || null,
        dateApplied || null,
        notes || '',
        JSON.stringify(checklist || defaultChecklist),
      ]
    );

    const [created] = await pool.query('SELECT * FROM applications WHERE id = ?', [result.insertId]);
    res.status(201).json(formatApplicationRow(created[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update tracked application in MAMP
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;
    const appId = parseInt(req.params.id, 10);
    const { status, deadline, dateApplied, notes, checklist } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE id = ? AND user_id = ?',
      [appId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Application record not found or unauthorized' });
    }

    await pool.query(
      `UPDATE applications
       SET status = COALESCE(?, status),
           deadline = COALESCE(?, deadline),
           date_applied = COALESCE(?, date_applied),
           notes = COALESCE(?, notes),
           checklist = COALESCE(?, checklist)
       WHERE id = ? AND user_id = ?`,
      [
        status || null,
        deadline || null,
        dateApplied || null,
        notes !== undefined ? notes : null,
        checklist ? JSON.stringify(checklist) : null,
        appId,
        userId,
      ]
    );

    const [updated] = await pool.query('SELECT * FROM applications WHERE id = ?', [appId]);
    res.json(formatApplicationRow(updated[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete tracked application from MAMP
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user.id;
    const appId = parseInt(req.params.id, 10);

    const [result] = await pool.query(
      'DELETE FROM applications WHERE id = ? AND user_id = ?',
      [appId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application record not found' });
    }

    res.json({ message: 'Application deleted successfully from MAMP' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
