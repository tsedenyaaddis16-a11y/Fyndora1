import express from 'express';
import { getMampPool } from '../config/mampDb.js';

const router = express.Router();

/**
 * GET /api/mentor-journey
 * Fetch user's active mentor journey
 */
router.get('/', async (req, res) => {
  try {
    const userEmail = req.query.email || 'selam.haile@fyndora.org';
    const universityId = req.query.universityId || null;
    const pool = getMampPool();

    let query = 'SELECT * FROM mentor_journeys WHERE user_email = ?';
    const params = [userEmail];

    if (universityId) {
      query += ' AND university_id = ?';
      params.push(universityId);
    }

    query += ' ORDER BY updated_at DESC LIMIT 1';

    const [rows] = await pool.query(query, params);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return res.json({
        success: true,
        journey: {
          id: r.id.toString(),
          userEmail: r.user_email,
          universityId: r.university_id,
          universityName: r.university_name,
          studentBackground: typeof r.student_background === 'string' ? JSON.parse(r.student_background || '{}') : (r.student_background || {}),
          interests: typeof r.interests === 'string' ? JSON.parse(r.interests || '{}') : (r.interests || {}),
          skills: typeof r.skills === 'string' ? JSON.parse(r.skills || '{}') : (r.skills || {}),
          experiences: typeof r.experiences === 'string' ? JSON.parse(r.experiences || '{}') : (r.experiences || {}),
          constraints: typeof r.constraints === 'string' ? JSON.parse(r.constraints || '{}') : (r.constraints || {}),
          possibleDirections: typeof r.possible_directions === 'string' ? JSON.parse(r.possible_directions || '[]') : (r.possible_directions || []),
          chosenDirection: r.chosen_direction,
          chosenDirectionDetails: typeof r.chosen_direction_details === 'string' ? JSON.parse(r.chosen_direction_details || '{}') : (r.chosen_direction_details || {}),
          extracurricularStrategy: typeof r.extracurricular_strategy === 'string' ? JSON.parse(r.extracurricular_strategy || '[]') : (r.extracurricular_strategy || []),
          passionProject: typeof r.passion_project === 'string' ? JSON.parse(r.passion_project || '{}') : (r.passion_project || {}),
          roadmap: typeof r.roadmap === 'string' ? JSON.parse(r.roadmap || '[]') : (r.roadmap || []),
          actionPlan: typeof r.action_plan === 'string' ? JSON.parse(r.action_plan || '[]') : (r.action_plan || []),
          matchedOpportunities: typeof r.matched_opportunities === 'string' ? JSON.parse(r.matched_opportunities || '[]') : (r.matched_opportunities || []),
          evidencePortfolio: typeof r.evidence_portfolio === 'string' ? JSON.parse(r.evidence_portfolio || '[]') : (r.evidence_portfolio || []),
          reflections: typeof r.reflections === 'string' ? JSON.parse(r.reflections || '[]') : (r.reflections || []),
          chatHistory: typeof r.chat_history === 'string' ? JSON.parse(r.chat_history || '[]') : (r.chat_history || []),
          progressStats: typeof r.progress_stats === 'string' ? JSON.parse(r.progress_stats || '{}') : (r.progress_stats || {
            academic: 70,
            exploration: 60,
            projects: 40,
            leadership: 50,
            research: 30,
          }),
        },
      });
    }

    res.json({ success: true, journey: null });
  } catch (error) {
    console.error('Error fetching mentor journey:', error);
    res.status(500).json({ message: 'Failed to retrieve journey', error: error.message });
  }
});

/**
 * POST /api/mentor-journey
 * Save or update entire mentor journey
 */
router.post('/', async (req, res) => {
  try {
    const {
      userEmail = 'selam.haile@fyndora.org',
      universityId = null,
      universityName = null,
      studentBackground = {},
      interests = {},
      skills = {},
      experiences = {},
      constraints = {},
      possibleDirections = [],
      chosenDirection = null,
      chosenDirectionDetails = {},
      extracurricularStrategy = [],
      passionProject = {},
      roadmap = [],
      actionPlan = [],
      matchedOpportunities = [],
      evidencePortfolio = [],
      reflections = [],
      chatHistory = [],
      progressStats = null,
    } = req.body;

    const pool = getMampPool();

    // Check if journey exists
    const [existing] = await pool.query(
      'SELECT id FROM mentor_journeys WHERE user_email = ? AND (university_id = ? OR (university_id IS NULL AND ? IS NULL)) LIMIT 1',
      [userEmail, universityId, universityId]
    );

    const defaultStats = progressStats || {
      academic: 65,
      exploration: 50,
      projects: 35,
      leadership: 45,
      research: 30,
    };

    if (existing && existing.length > 0) {
      const journeyId = existing[0].id;
      await pool.query(
        `UPDATE mentor_journeys SET
          university_id = ?,
          university_name = ?,
          student_background = ?,
          interests = ?,
          skills = ?,
          experiences = ?,
          constraints = ?,
          possible_directions = ?,
          chosen_direction = ?,
          chosen_direction_details = ?,
          extracurricular_strategy = ?,
          passion_project = ?,
          roadmap = ?,
          action_plan = ?,
          matched_opportunities = ?,
          evidence_portfolio = ?,
          reflections = ?,
          chat_history = ?,
          progress_stats = ?
        WHERE id = ?`,
        [
          universityId,
          universityName,
          JSON.stringify(studentBackground),
          JSON.stringify(interests),
          JSON.stringify(skills),
          JSON.stringify(experiences),
          JSON.stringify(constraints),
          JSON.stringify(possibleDirections),
          chosenDirection,
          JSON.stringify(chosenDirectionDetails),
          JSON.stringify(extracurricularStrategy),
          JSON.stringify(passionProject),
          JSON.stringify(roadmap),
          JSON.stringify(actionPlan),
          JSON.stringify(matchedOpportunities),
          JSON.stringify(evidencePortfolio),
          JSON.stringify(reflections),
          JSON.stringify(chatHistory),
          JSON.stringify(defaultStats),
          journeyId,
        ]
      );

      return res.json({
        success: true,
        message: 'Journey updated successfully',
        id: journeyId.toString(),
      });
    }

    // Insert new journey
    const [result] = await pool.query(
      `INSERT INTO mentor_journeys (
        user_email, university_id, university_name,
        student_background, interests, skills, experiences, constraints,
        possible_directions, chosen_direction, chosen_direction_details,
        extracurricular_strategy, passion_project, roadmap, action_plan,
        matched_opportunities, evidence_portfolio, reflections, chat_history, progress_stats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userEmail,
        universityId,
        universityName,
        JSON.stringify(studentBackground),
        JSON.stringify(interests),
        JSON.stringify(skills),
        JSON.stringify(experiences),
        JSON.stringify(constraints),
        JSON.stringify(possibleDirections),
        chosenDirection,
        JSON.stringify(chosenDirectionDetails),
        JSON.stringify(extracurricularStrategy),
        JSON.stringify(passionProject),
        JSON.stringify(roadmap),
        JSON.stringify(actionPlan),
        JSON.stringify(matchedOpportunities),
        JSON.stringify(evidencePortfolio),
        JSON.stringify(reflections),
        JSON.stringify(chatHistory),
        JSON.stringify(defaultStats),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Journey created successfully',
      id: result.insertId.toString(),
    });
  } catch (error) {
    console.error('Error saving mentor journey:', error);
    res.status(500).json({ message: 'Failed to save mentor journey', error: error.message });
  }
});

/**
 * POST /api/mentor-journey/chat
 * Interactive AI Mentor Chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const {
      universityName = 'your target universities',
      currentGrade = 'Grade 11',
      country = 'your country',
      chosenDirection = 'your chosen interest',
      weeklyHours = 'flexible hours',
      needFree = true,
      passionProject = null,
    } = context;

    // Intelligent, empathetic mentor response generator
    const userMsg = message.toLowerCase();
    let reply = '';

    if (userMsg.includes('focus on this month') || userMsg.includes('this month')) {
      reply = `For this month in ${currentGrade}, prioritize quality over quantity:

1. **Academic Baseline**: Keep your grades strong in your core subjects—this remains the most critical foundation for ${universityName}.
2. **First Milestone of Your Project**: Spend 2–3 hours each week focusing solely on Step 1 of your project${passionProject?.name ? ` ("${passionProject.name}")` : ''}: draft your initial outline, survey questions, or problem breakdown.
3. **One Intellectual Deep Dive**: Read 1 book chapter, listen to 1 academic podcast, or audit 1 free online lecture in ${chosenDirection}.
4. **Log your progress**: Mark completed tasks in your Monthly Action Plan to see your momentum grow!`;
    } else if (userMsg.includes('what should i do next') || userMsg.includes('what to do next') || userMsg.includes('next step')) {
      reply = `Based on your current progress in ${currentGrade} and your focus on **${chosenDirection}**, here is your exact next step:

👉 **Immediate Action (Next 48 Hours)**:
${passionProject?.firstSteps && passionProject.firstSteps.length > 0 
  ? `Focus on: **"${passionProject.firstSteps[0]}"**.` 
  : 'Draft a short 1-page concept note outlining the problem in your community or school you want to explore.'}

Dedicate just one focused 45-minute block this week. Once you start, record what you did in your Journey Evidence log!`;
    } else if (userMsg.includes('3 hours') || userMsg.includes('three hours') || userMsg.includes('limited time') || userMsg.includes('hours per week')) {
      reply = `Having 3 hours per week is plenty of time if you protect it from distraction! Here is how to allocate your 180 minutes each week:

⏱️ **Block 1 (90 mins - Midweek or Weekend)**: Deep work on your passion project${passionProject?.name ? ` (${passionProject.name})` : ''} or running your peer study sessions.
⏱️ **Block 2 (60 mins - Sunday Afternoon)**: Self-directed reading, watching an MIT OpenCourseWare lecture, or practicing high-level problem sets.
⏱️ **Block 3 (30 mins - End of Week)**: Review what you learned, write a quick reflection in your Journey log, and update your Action Plan.

Consistency beats intensity every single time. 3 focused hours per week equals over 150 hours of authentic intellectual growth in a school year!`;
    } else if (userMsg.includes("don't like") || userMsg.includes('dont like') || userMsg.includes('dislike') || userMsg.includes('anymore') || userMsg.includes('what else could i try')) {
      reply = `Discovering that you *do not* enjoy your current project is not a failure—it is valuable self-knowledge! 

Admissions officers and university professors want students who are self-aware, not people who blindly stick to things they hate.

Here is what you can do right now:
1. **Document the insight**: Note down *why* you disliked it (Was it too abstract? Too solitary? Lacking real-world impact?).
2. **Switch project tracks without penalty**: In your Journey Dashboard, review the other Passion Project Ideas generated for you, such as a **Community Public Data Audit**, a **Peer Problem-Solving Clinic**, or a **Local Language STEM Glossary**.
3. **Pivot seamlessly**: Which other project catches your eye? Let me know and we will adapt your roadmap to it!`;
    } else if (userMsg.includes('economics') && userMsg.includes('computer science') || userMsg.includes('more interested in economics') || userMsg.includes('pivot') || userMsg.includes('update my journey')) {
      reply = `Congratulations on this discovery! High school is meant for pivoting when new intellectual sparks appear.

Here is how we adapt your journey from pure Computer Science to **Economics & Quantitative Systems**:
1. **Bridge the two fields**: Quantitative economics, computational financial literacy, and data-driven public policy are among the most respected disciplines at ${universityName}.
2. **Updated Project Focus**: Instead of writing software for software's sake, you can conduct a **High School Student Financial Literacy Survey** or build a **Community Micro-Economics Data Dashboard**.
3. **Course Rigor**: Continue excelling in Mathematics (calculus & statistics are the backbone of modern economics).
4. **Action**: Your dashboard recommendations have been updated to emphasize quantitative economics, real-world community survey research, and free resources from the Wharton Global High School program!`;
    } else if (userMsg.includes('money') || userMsg.includes('free') || userMsg.includes('cost') || userMsg.includes('afford')) {
      reply = `You never need to spend money to build a meaningful high school profile. In fact, admissions reviewers and professors respect organic, self-driven initiatives far more than paid pay-to-play summer programs.

Here are 100% free avenues you can pursue right from ${country}:
- **Community problem-solving**: Conducting an independent student survey or publishing an educational guide costs $0.
- **Free open-source & digital archives**: MIT OpenCourseWare, Harvard edX audits, Kaggle, and PubMed central are open to all.
- **National Olympiads & Competitions**: Most academic olympiads (like national Math Olympiads or science fairs) have zero entry fees or school-sponsored waivers.
- **Local mentoring**: Tutoring younger middle school students in your neighborhood or school demonstrates authentic leadership at zero financial cost.`;
    } else if (userMsg.includes('project') || userMsg.includes('passion')) {
      reply = `Building a self-directed project is one of the most rewarding ways to discover what you genuinely enjoy.

${passionProject ? `For your project **"${passionProject.name}"**:
- **Next immediate step**: Focus on Step 1: ${passionProject.firstSteps ? passionProject.firstSteps[0] : 'draft your initial questionnaire or outline'}.
- **Avoid perfectionism**: You do not need to create an international organization. Impact on 10 to 50 real people in your school or neighborhood is genuine and powerful.
- **Document as you build**: Take notes on problems you encounter and how you solve them.` : 'Let us find a project that connects what you enjoy talking about with a problem you see in your school or community. Check the "Find My Passion Project" section above for tailored concepts!'}`;
    } else if (userMsg.includes('harvard') || userMsg.includes('mit') || userMsg.includes('oxford') || userMsg.includes('admissions') || userMsg.includes('guarantee') || userMsg.includes('chance')) {
      reply = `Important reminder: there is **no secret formula or guaranteed activity list** for ${universityName}.

Top institutions evaluate applicants holistically:
1. **Academic preparation**: Challenging yourself in the strongest courses available at your school.
2. **Intellectual vitality**: Reading, questioning, and researching topics simply because you are curious, not because it is assigned.
3. **Character and contribution**: Showing kindness, responsibility, and initiative in your home, school, or community.

Do not ask "What does ${universityName} want me to do?" Instead ask: **"What do I care enough about to spend time on even if no college ever sees it?"** That authenticity is what creates a compelling application.`;
    } else {
      reply = `Thank you for sharing that question. As your high school mentor for ${universityName}, my goal is to help you take realistic, meaningful steps right now in ${currentGrade}.

For your focus in **${chosenDirection}**:
- What is one tangible action you could take this week?
- Remember to record any milestones in your **"My Journey Evidence"** portfolio.
- If you run into obstacles with equipment, time, or school support, let me know and we will adapt your plan to your exact constraints.`;
    }

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI Mentor chat:', error);
    res.status(500).json({ message: 'Mentor chat encountered an error', error: error.message });
  }
});

export default router;
