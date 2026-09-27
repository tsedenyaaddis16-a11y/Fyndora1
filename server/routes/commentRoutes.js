import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Optional authentication helper:
 * populates req.user if token is present, but does not reject request if token is absent
 */
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      await protect(req, res, () => next());
      return;
    } catch (e) {
      // ignore and continue as guest
    }
  }
  next();
};

/**
 * GET /api/comments
 * Query params:
 *   - targetType: 'career' | 'scholarship' | 'opportunity' | 'general'
 *   - targetId: target identifier (e.g. 'software-engineer' or '1')
 *   - sort: 'newest' | 'likes'
 */
router.get('/', async (req, res) => {
  try {
    const { targetType, targetId, sort = 'newest' } = req.query;
    const pool = getMampPool();

    let query = 'SELECT * FROM comments WHERE 1=1';
    const params = [];

    if (targetType && targetType !== 'all') {
      query += ' AND target_type = ?';
      params.push(targetType);
    }

    if (targetId && targetId !== 'all') {
      query += ' AND target_id = ?';
      params.push(targetId);
    }

    if (sort === 'likes') {
      query += ' ORDER BY likes DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const [rows] = await pool.query(query, params);

    // Format rows and build reply hierarchy
    const formatted = rows.map(r => ({
      id: r.id.toString(),
      targetType: r.target_type,
      targetId: r.target_id,
      targetTitle: r.target_title || '',
      userId: r.user_id ? r.user_id.toString() : null,
      userName: r.user_name,
      userEmail: r.user_email,
      userRole: r.user_role || 'student',
      userCountry: r.user_country || 'Ethiopia',
      userGrade: r.user_grade || 'Grade 11',
      parentId: r.parent_id ? r.parent_id.toString() : null,
      content: r.content,
      likes: r.likes || 0,
      likedBy: typeof r.liked_by === 'string' ? JSON.parse(r.liked_by || '[]') : (r.liked_by || []),
      createdAt: r.created_at,
      replies: [],
    }));

    // If query was for a specific target, return threaded structure
    // Top-level comments with replies attached
    const commentMap = new Map();
    formatted.forEach(c => commentMap.set(c.id, c));

    const topLevel = [];
    formatted.forEach(c => {
      if (c.parentId && commentMap.has(c.parentId)) {
        commentMap.get(c.parentId).replies.push(c);
      } else {
        topLevel.push(c);
      }
    });

    res.json({
      success: true,
      count: formatted.length,
      comments: topLevel,
      allCommentsFlat: formatted,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to retrieve comments', error: error.message });
  }
});

/**
 * POST /api/comments
 * Add a new comment or reply
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { targetType, targetId, targetTitle = '', content, parentId = null } = req.body;

    if (!targetType || !targetId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Target type, target id, and comment content are required' });
    }

    const pool = getMampPool();

    // Determine user info from auth or request body
    const user = req.user || {};
    const userId = user.id || req.body.userId || null;
    const userName = user.name || req.body.userName || 'Student Learner';
    const userEmail = user.email || req.body.userEmail || 'student@fyndora.org';
    const userRole = user.role || req.body.userRole || 'student';
    const userCountry = user.country || req.body.userCountry || 'Ethiopia';
    const userGrade = user.grade || req.body.userGrade || 'Grade 11';

    const [result] = await pool.query(
      `INSERT INTO comments 
        (target_type, target_id, target_title, user_id, user_name, user_email, user_role, user_country, user_grade, parent_id, content, likes, liked_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '[]')`,
      [
        targetType,
        targetId,
        targetTitle,
        userId,
        userName,
        userEmail,
        userRole,
        userCountry,
        userGrade,
        parentId ? parseInt(parentId, 10) : null,
        content.trim(),
      ]
    );

    const newComment = {
      id: result.insertId.toString(),
      targetType,
      targetId,
      targetTitle,
      userId: userId ? userId.toString() : null,
      userName,
      userEmail,
      userRole,
      userCountry,
      userGrade,
      parentId: parentId ? parentId.toString() : null,
      content: content.trim(),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      replies: [],
    };

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Failed to post comment', error: error.message });
  }
});

/**
 * POST /api/comments/:id/like
 * Upvote or unlike a comment
 */
router.post('/:id/like', optionalAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id, 10);
    const pool = getMampPool();

    const [rows] = await pool.query('SELECT id, likes, liked_by FROM comments WHERE id = ?', [commentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const currentComment = rows[0];
    let likedBy = typeof currentComment.liked_by === 'string'
      ? JSON.parse(currentComment.liked_by || '[]')
      : (currentComment.liked_by || []);

    const userIdentifier = req.user?.email || req.body.userEmail || 'guest_' + req.ip;

    let newLikes = currentComment.likes || 0;
    if (likedBy.includes(userIdentifier)) {
      // Remove like
      likedBy = likedBy.filter(u => u !== userIdentifier);
      newLikes = Math.max(0, newLikes - 1);
    } else {
      // Add like
      likedBy.push(userIdentifier);
      newLikes += 1;
    }

    await pool.query(
      'UPDATE comments SET likes = ?, liked_by = ? WHERE id = ?',
      [newLikes, JSON.stringify(likedBy), commentId]
    );

    res.json({
      success: true,
      id: commentId.toString(),
      likes: newLikes,
      likedBy,
      hasLiked: likedBy.includes(userIdentifier),
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment and its child replies
 */
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id, 10);
    const pool = getMampPool();

    const [rows] = await pool.query('SELECT id, user_id, user_email FROM comments WHERE id = ?', [commentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const c = rows[0];
    const isOwner = req.user && (req.user.id === c.user_id || req.user.email === c.user_email);
    const isAdmin = req.user && req.user.role === 'admin';

    // Allow deletion if owner, admin, or fallback demo mode
    if (req.user && !isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    // Delete comment and its replies
    await pool.query('DELETE FROM comments WHERE id = ? OR parent_id = ?', [commentId, commentId]);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      id: commentId.toString(),
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
});

export default router;
