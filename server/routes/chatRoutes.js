import express from 'express';
import { getMampPool } from '../config/mampDb.js';
import { optionalAuth } from '../middleware/auth.js';
import { getAiMentorResponse, checkRateLimit } from '../services/aiService.js';

const router = express.Router();

/**
 * GET /api/chat/status
 * Check AI configuration status
 */
router.get('/status', (req, res) => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() && !process.env.OPENAI_API_KEY.includes('your_openai_api_key'));
  res.json({
    success: true,
    aiConfigured: hasKey,
    provider: hasKey ? (process.env.AI_PROVIDER || 'openai') : 'built-in-mentor',
    model: process.env.AI_MODEL || (hasKey ? 'gpt-4o-mini' : 'Fyndora Intelligent Mentor v2.0'),
    message: hasKey
      ? 'Live AI provider active'
      : 'Built-in intelligent mentorship engine active (Add OPENAI_API_KEY in server/.env for external LLM models)',
  });
});

/**
 * GET /api/chat/profile
 * Get student chatbot personalization profile
 */
router.get('/profile', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || null;

    if (!userId && !sessionId) {
      return res.json({ success: true, profile: null });
    }

    let query = 'SELECT * FROM chat_student_profiles WHERE ';
    const params = [];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    query += ' LIMIT 1';

    const [rows] = await pool.query(query, params);

    if (rows && rows.length > 0) {
      const p = rows[0];
      return res.json({
        success: true,
        profile: {
          id: p.id,
          preferredName: p.preferred_name,
          country: p.country,
          grade: p.grade,
          academicInterests: typeof p.academic_interests === 'string' ? JSON.parse(p.academic_interests || '[]') : p.academic_interests || [],
          careerGoals: typeof p.career_goals === 'string' ? JSON.parse(p.career_goals || '[]') : p.career_goals || [],
          targetUniversities: typeof p.target_universities === 'string' ? JSON.parse(p.target_universities || '[]') : p.target_universities || [],
          extracurriculars: p.extracurriculars,
          weeklyHours: p.weekly_hours,
          financialConstraints: p.financial_constraints,
          updatedAt: p.updated_at,
        },
      });
    }

    // If logged in, seed from user table
    if (req.user) {
      return res.json({
        success: true,
        profile: {
          preferredName: req.user.name,
          country: req.user.country || 'Ethiopia',
          grade: req.user.grade || 'Grade 11',
          academicInterests: req.user.interests || [],
          careerGoals: req.user.preferredFields || [],
          targetUniversities: req.user.preferredCountries || [],
          extracurriculars: '',
          weeklyHours: '3–5 hours/week',
          financialConstraints: req.user.fundingPreference || 'Need free / full scholarships',
        },
      });
    }

    res.json({ success: true, profile: null });
  } catch (error) {
    console.error('Error fetching chat profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student profile', error: error.message });
  }
});

/**
 * PUT /api/chat/profile
 * Save or update student chatbot personalization profile
 */
router.put('/profile', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user?.id || null;
    const {
      sessionId = 'guest_' + Date.now(),
      preferredName,
      country = 'Ethiopia',
      grade = 'Grade 11',
      academicInterests = [],
      careerGoals = [],
      targetUniversities = [],
      extracurriculars = '',
      weeklyHours = '3–5 hours/week',
      financialConstraints = 'Need free / full scholarships',
    } = req.body;

    const academicInterestsJson = JSON.stringify(academicInterests);
    const careerGoalsJson = JSON.stringify(careerGoals);
    const targetUniversitiesJson = JSON.stringify(targetUniversities);

    // Check if profile exists
    let existingQuery = 'SELECT id FROM chat_student_profiles WHERE ';
    const existingParams = [];
    if (userId) {
      existingQuery += 'user_id = ?';
      existingParams.push(userId);
    } else {
      existingQuery += 'session_id = ?';
      existingParams.push(sessionId);
    }
    existingQuery += ' LIMIT 1';

    const [existing] = await pool.query(existingQuery, existingParams);

    if (existing && existing.length > 0) {
      const profileId = existing[0].id;
      await pool.query(
        `UPDATE chat_student_profiles SET
          preferred_name = ?,
          country = ?,
          grade = ?,
          academic_interests = ?,
          career_goals = ?,
          target_universities = ?,
          extracurriculars = ?,
          weekly_hours = ?,
          financial_constraints = ?
        WHERE id = ?`,
        [
          preferredName,
          country,
          grade,
          academicInterestsJson,
          careerGoalsJson,
          targetUniversitiesJson,
          extracurriculars,
          weeklyHours,
          financialConstraints,
          profileId,
        ]
      );
      return res.json({ success: true, message: 'Profile updated successfully', id: profileId });
    }

    // Insert new profile
    const [result] = await pool.query(
      `INSERT INTO chat_student_profiles (
        user_id, session_id, preferred_name, country, grade,
        academic_interests, career_goals, target_universities,
        extracurriculars, weekly_hours, financial_constraints
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        sessionId,
        preferredName,
        country,
        grade,
        academicInterestsJson,
        careerGoalsJson,
        targetUniversitiesJson,
        extracurriculars,
        weeklyHours,
        financialConstraints,
      ]
    );

    res.status(201).json({ success: true, message: 'Profile created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error saving chat profile:', error);
    res.status(500).json({ success: false, message: 'Failed to save student profile', error: error.message });
  }
});

/**
 * GET /api/chat/conversations
 * List student's conversations
 */
router.get('/conversations', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || null;

    if (!userId && !sessionId) {
      return res.json({ success: true, conversations: [] });
    }

    let query = 'SELECT id, title, page_context, created_at, updated_at FROM chat_conversations WHERE ';
    const params = [];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    query += ' ORDER BY updated_at DESC LIMIT 30';

    const [rows] = await pool.query(query, params);

    const conversations = rows.map((r) => ({
      id: r.id.toString(),
      title: r.title,
      pageContext: typeof r.page_context === 'string' ? JSON.parse(r.page_context || 'null') : r.page_context,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error listing conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations', error: error.message });
  }
});

/**
 * POST /api/chat/conversations
 * Start a new conversation
 */
router.post('/conversations', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user?.id || null;
    const { sessionId = 'guest_' + Date.now(), title = 'New Conversation', pageContext = null } = req.body;

    const [result] = await pool.query(
      'INSERT INTO chat_conversations (user_id, session_id, title, page_context) VALUES (?, ?, ?, ?)',
      [userId, sessionId, title, JSON.stringify(pageContext)]
    );

    res.status(201).json({
      success: true,
      conversation: {
        id: result.insertId.toString(),
        title,
        pageContext,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to create conversation', error: error.message });
  }
});

/**
 * GET /api/chat/conversations/:id
 * Get a specific conversation and all messages
 */
router.get('/conversations/:id', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const convId = parseInt(req.params.id, 10);
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || null;

    if (isNaN(convId)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    // Verify conversation existence and ownership
    const [convRows] = await pool.query('SELECT * FROM chat_conversations WHERE id = ?', [convId]);
    if (!convRows || convRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const conv = convRows[0];
    if (conv.user_id && userId && conv.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this conversation' });
    }

    // Fetch messages
    const [msgRows] = await pool.query(
      'SELECT id, sender, content, metadata, created_at FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [convId]
    );

    const messages = msgRows.map((m) => ({
      id: m.id.toString(),
      sender: m.sender,
      content: m.content,
      metadata: typeof m.metadata === 'string' ? JSON.parse(m.metadata || 'null') : m.metadata,
      createdAt: m.created_at,
    }));

    res.json({
      success: true,
      conversation: {
        id: conv.id.toString(),
        title: conv.title,
        pageContext: typeof conv.page_context === 'string' ? JSON.parse(conv.page_context || 'null') : conv.page_context,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        messages,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversation', error: error.message });
  }
});

/**
 * DELETE /api/chat/conversations/:id
 * Delete a single conversation
 */
router.delete('/conversations/:id', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const convId = parseInt(req.params.id, 10);
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || null;

    if (isNaN(convId)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    const [rows] = await pool.query('SELECT * FROM chat_conversations WHERE id = ?', [convId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const conv = rows[0];
    if (conv.user_id && userId && conv.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this conversation' });
    }

    await pool.query('DELETE FROM chat_conversations WHERE id = ?', [convId]);

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to delete conversation', error: error.message });
  }
});

/**
 * DELETE /api/chat/conversations
 * Clear all conversations for current user or session
 */
router.delete('/conversations', optionalAuth, async (req, res) => {
  try {
    const pool = getMampPool();
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || null;

    if (!userId && !sessionId) {
      return res.status(400).json({ success: false, message: 'User or session identifier required' });
    }

    if (userId) {
      await pool.query('DELETE FROM chat_conversations WHERE user_id = ?', [userId]);
    } else {
      await pool.query('DELETE FROM chat_conversations WHERE session_id = ?', [sessionId]);
    }

    res.json({ success: true, message: 'All conversations cleared successfully' });
  } catch (error) {
    console.error('Error clearing conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to clear conversations', error: error.message });
  }
});

/**
 * POST /api/chat/message
 * Send message and receive AI / Mentor response
 */
router.post('/message', optionalAuth, async (req, res) => {
  try {
    const {
      conversationId: clientConvId,
      message,
      pageContext = null,
      sessionId = 'guest_' + Date.now(),
      studentProfile = {},
    } = req.body;

    const userId = req.user?.id || null;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ success: false, message: 'Message exceeds maximum length (4,000 characters)' });
    }

    const pool = getMampPool();
    let conversationId = clientConvId ? parseInt(clientConvId, 10) : null;

    // Verify or create conversation
    if (conversationId) {
      const [existingConv] = await pool.query('SELECT id, title FROM chat_conversations WHERE id = ?', [conversationId]);
      if (!existingConv || existingConv.length === 0) {
        conversationId = null;
      }
    }

    if (!conversationId) {
      // Auto-generate title from first 6-8 words of message
      const words = message.trim().split(/\s+/).slice(0, 6).join(' ');
      const autoTitle = words.length > 40 ? words.substring(0, 37) + '...' : words;

      const [newConv] = await pool.query(
        'INSERT INTO chat_conversations (user_id, session_id, title, page_context) VALUES (?, ?, ?, ?)',
        [userId, sessionId, autoTitle, JSON.stringify(pageContext)]
      );
      conversationId = newConv.insertId;
    }

    // 1. Save user's message
    await pool.query(
      'INSERT INTO chat_messages (conversation_id, sender, content, metadata) VALUES (?, ?, ?, ?)',
      [conversationId, 'user', message.trim(), JSON.stringify({ pageContext })]
    );

    // 2. Fetch recent conversation context (last 10 messages in ascending order)
    const [recentMsgs] = await pool.query(
      `SELECT sender, content FROM (
        SELECT id, sender, content FROM chat_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 10
      ) sub ORDER BY id ASC`,
      [conversationId]
    );
    const orderedHistory = recentMsgs;

    // 3. Resolve student profile (merge body, database, and auth user)
    let effectiveProfile = { ...studentProfile };
    if (userId) {
      const [dbProfile] = await pool.query('SELECT * FROM chat_student_profiles WHERE user_id = ? LIMIT 1', [userId]);
      if (dbProfile && dbProfile.length > 0) {
        const p = dbProfile[0];
        effectiveProfile = {
          preferredName: p.preferred_name || req.user.name,
          country: p.country || req.user.country,
          grade: p.grade || req.user.grade,
          academicInterests: typeof p.academic_interests === 'string' ? JSON.parse(p.academic_interests || '[]') : p.academic_interests || [],
          careerGoals: typeof p.career_goals === 'string' ? JSON.parse(p.career_goals || '[]') : p.career_goals || [],
          targetUniversities: typeof p.target_universities === 'string' ? JSON.parse(p.target_universities || '[]') : p.target_universities || [],
          extracurriculars: p.extracurriculars || '',
          weeklyHours: p.weekly_hours || '3–5 hours/week',
          financialConstraints: p.financial_constraints || req.user.fundingPreference,
          ...effectiveProfile,
        };
      } else if (req.user) {
        effectiveProfile = {
          preferredName: req.user.name,
          country: req.user.country || 'Ethiopia',
          grade: req.user.grade || 'Grade 11',
          academicInterests: req.user.interests || [],
          careerGoals: req.user.preferredFields || [],
          targetUniversities: req.user.preferredCountries || [],
          weeklyHours: '3–5 hours/week',
          financialConstraints: req.user.fundingPreference || 'Need free / full scholarships',
          ...effectiveProfile,
        };
      }
    }

    // 4. Generate AI response
    const aiResult = await getAiMentorResponse({
      messages: orderedHistory,
      studentProfile: effectiveProfile,
      pageContext,
      clientIp,
    });

    // 5. Save assistant message
    const [assistantMsgResult] = await pool.query(
      'INSERT INTO chat_messages (conversation_id, sender, content, metadata) VALUES (?, ?, ?, ?)',
      [
        conversationId,
        'assistant',
        aiResult.reply,
        JSON.stringify({
          suggestedPrompts: aiResult.suggestedPrompts,
          meta: aiResult.meta,
        }),
      ]
    );

    // 6. Update conversation timestamp
    await pool.query('UPDATE chat_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [conversationId]);

    res.json({
      success: true,
      conversationId: conversationId.toString(),
      message: {
        id: assistantMsgResult.insertId.toString(),
        sender: 'assistant',
        content: aiResult.reply,
        metadata: {
          suggestedPrompts: aiResult.suggestedPrompts,
          meta: aiResult.meta,
        },
        createdAt: new Date().toISOString(),
      },
      suggestedPrompts: aiResult.suggestedPrompts,
      meta: aiResult.meta,
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat message',
    });
  }
});

export default router;
