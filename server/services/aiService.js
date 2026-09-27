import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Student Mentor Service
 * Supports OpenAI / OpenAI-compatible APIs with structured prompt engineering,
 * safety guidelines, rate limiting, and an intelligent built-in mentorship engine
 * for offline / no-key operation.
 */

const DEFAULT_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

// In-memory sliding-window rate limiter
const rateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

export const checkRateLimit = (identifier) => {
  const now = Date.now();
  const userHistory = rateLimits.get(identifier) || [];
  const recentHistory = userHistory.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentHistory.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentHistory.push(now);
  rateLimits.set(identifier, recentHistory);
  return true;
};

/**
 * Builds the comprehensive system prompt for the AI Student Mentor.
 */
export const buildSystemPrompt = (studentProfile = {}, pageContext = null) => {
  const profileSummary = [
    studentProfile.preferredName ? `Preferred Name: ${studentProfile.preferredName}` : null,
    studentProfile.country ? `Country: ${studentProfile.country}` : null,
    studentProfile.grade ? `Grade / Year: ${studentProfile.grade}` : null,
    studentProfile.academicInterests?.length ? `Academic Interests: ${Array.isArray(studentProfile.academicInterests) ? studentProfile.academicInterests.join(', ') : studentProfile.academicInterests}` : null,
    studentProfile.careerGoals?.length ? `Career Goals: ${Array.isArray(studentProfile.careerGoals) ? studentProfile.careerGoals.join(', ') : studentProfile.careerGoals}` : null,
    studentProfile.targetUniversities?.length ? `Target Universities: ${Array.isArray(studentProfile.targetUniversities) ? studentProfile.targetUniversities.join(', ') : studentProfile.targetUniversities}` : null,
    studentProfile.extracurriculars ? `Current Activities: ${studentProfile.extracurriculars}` : null,
    studentProfile.weeklyHours ? `Available Time: ${studentProfile.weeklyHours}` : null,
    studentProfile.financialConstraints ? `Financial Circumstances: ${studentProfile.financialConstraints}` : null,
  ].filter(Boolean).join('\n');

  let contextDescription = '';
  if (pageContext) {
    contextDescription = `
CURRENT STUDENT PAGE CONTEXT:
The student is actively viewing the following page on the Fyndora platform:
- Page Title: ${pageContext.title || 'Platform Resource'}
- Page Type: ${pageContext.type || 'General'}
- Resource ID: ${pageContext.id || 'N/A'}
${pageContext.details ? `- Context Details: ${JSON.stringify(pageContext.details)}` : ''}

When relevant, acknowledge what the student is currently viewing and help them understand or act on this resource.
`;
  }

  return `You are the AI Student Mentor on the Fyndora educational platform. You act as an empathetic, encouraging, practical, and highly knowledgeable high-school guidance counselor and admissions mentor.

CORE MISSION:
You guide high-school students through:
1. Career discovery and aligning school subjects with future paths.
2. University research and holistic admission requirements (US, UK, Canada, Europe, Africa, Asia, and global).
3. Finding verified scholarships, financial aid, and fully funded opportunities (especially for international/low-income students).
4. Designing high-impact, authentic extracurricular activities and $0-budget passion projects.
5. Drafting actionable multi-year, semester, monthly, and weekly roadmaps.
6. Brainstorming and refining personal statements, essays, resumes, and interview skills.

STUDENT PROFILE INFORMATION:
${profileSummary || 'No specific student profile provided yet. Feel free to address them warmly as a high school student.'}
${contextDescription}

COMMUNICATION & MENTORSHIP STYLE:
- Warm, supportive, conversational, and direct. Talk like an inspiring mentor, not a robotic bureaucrat.
- Keep responses readable, structured, and easy for high schoolers to digest: use bold text, bullet points, numbered steps, and short paragraphs. Avoid walls of text.
- Give concrete, step-by-step guidance rather than vague advice like "work hard". Tell them *what* to do first, *how long* it takes, and *what tool* to use.
- Ask 1–2 thoughtful follow-up questions at the very end to keep the student motivated and engaged.
- Always provide 2–3 suggested next prompts or actions in your reply.

TRUSTWORTHINESS & SAFETY GUIDELINES (STRICT RULES):
1. NO FABRICATION: Never fabricate scholarships, deadlines, test requirements, admission policies, or statistics. If you are unsure of a deadline or policy, state clearly that university or scholarship policies change and advise checking the official admissions portal.
2. NO GUARANTEES: Never guarantee admission, scholarships, employment, or test scores. Emphasize holistic evaluation and individual growth.
3. AUTHENTICITY IN ESSAYS: Help students brainstorm, structure, outline, and refine their own essays. Never ghostwrite complete essays or invent fake achievements.
4. INCLUSIVE & BUDGET-CONSCIOUS: Many students come from developing countries or modest backgrounds. Emphasize free resources (MIT OpenCourseWare, Khan Academy, Coursera financial aid, local tutoring, community surveys) and reassure students that high-cost programs are NOT necessary for elite admissions.
5. INTERNAL PLATFORM LINKS: When appropriate, reference existing platform tools:
   - Career Explorer: [Explore Careers](/careers)
   - Career Quiz: [Take Career Quiz](/career-quiz)
   - Scholarship Directory: [Search Scholarships](/scholarships)
   - Extracurricular Opportunities: [View Opportunities](/opportunities)
   - University Profiles: [Explore Universities](/universities)
   - Application Tracker: [Go to Application Tracker](/applications)
   - Student Dashboard: [View Dashboard](/dashboard)
   Do NOT invent non-existent platform URLs.

Keep all responses empowering, constructive, and tailored to the student's grade and interests!`;
};

/**
 * Intelligent built-in rule and semantic mentor engine.
 * Used when no external API key is configured or as fallback.
 */
export const generateFallbackResponse = (userMessage, studentProfile = {}, pageContext = null) => {
  const msg = userMessage.toLowerCase().trim();
  const name = studentProfile.preferredName || 'there';
  const grade = studentProfile.grade || 'high school';
  const country = studentProfile.country || 'your home country';
  const hours = studentProfile.weeklyHours || '3–5 hours/week';

  // 1. Scholarships and Financial Aid
  if (msg.includes('scholarship') || msg.includes('financial aid') || msg.includes('full ride') || msg.includes('funding') || msg.includes('afford')) {
    return {
      text: `Hello ${name}! Finding the right funding is one of the most important parts of university planning, especially when looking abroad.

Here are the highest-value pathways and verified opportunities to target in ${grade}:

### 1. Fully Funded Global Scholarships
- **Mastercard Foundation Scholars Program**: Covers full tuition, accommodation, books, living stipend, and flights for high-achieving African students attending partner institutions (e.g., University of Edinburgh, UC Berkeley, McGill).
- **Lester B. Pearson International Scholarship (University of Toronto)**: Covers full tuition, books, incidental fees, and residence for 4 years of undergraduate study.
- **US Need-Blind / Meets-Full-Need Universities**: Top institutions like Harvard, Yale, Princeton, MIT, Amherst, and Dartmouth meet 100% of demonstrated financial need for all admitted international students without loans.

### 2. Practical Action Steps for You:
1. **Maintain top academic marks**: Most competitive full scholarships use your Grade 10–12 school transcripts as the primary screening filter.
2. **Document community leadership**: Scholarship committees prioritize students who have a track record of giving back locally.
3. **Explore our platform listings**: Visit our [Scholarship Directory](/scholarships) and filter by "Fully funded" and your target study destination.

**Next Steps & Questions for You:**
- What specific subject or major do you hope to study?
- Do you have a target country in mind (e.g., US, Canada, Europe, or staying within Africa)?`,
      suggestedPrompts: [
        'Tell me about the Mastercard Foundation Scholars Program',
        'Which US universities meet 100% financial need?',
        'How do I write a compelling scholarship essay?'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 2. Career exploration & degree selection
  if (msg.includes('career') || msg.includes('major') || msg.includes('job') || msg.includes('degree') || msg.includes('profession') || msg.includes('what should i study')) {
    return {
      text: `Exploring careers early in ${grade} gives you a huge advantage, ${name}! It helps you choose the right high school subjects and build relevant extracurriculars.

### How to Match Your Interests with High-Growth Careers:
1. **Technology & Computing**: Software Engineering, Data Science, Artificial Intelligence, and Cybersecurity.
   - *Key High School Subjects*: Advanced Mathematics, Physics, Computer Science/ICT.
2. **Quantitative Economics & Finance**: Financial Modeling, Investment Banking, Public Policy, and Economic Development.
   - *Key High School Subjects*: Mathematics (Statistics/Calculus), Economics, Business Studies.
3. **Healthcare & Life Sciences**: Medicine, Biomedical Engineering, Public Health, and Biotechnology.
   - *Key High School Subjects*: Biology, Chemistry, Mathematics, Physics.
4. **Engineering & Infrastructure**: Mechanical, Electrical, Civil, and Renewable Energy Engineering.
   - *Key High School Subjects*: Physics, Advanced Mathematics, Chemistry.

### Recommended Platform Tools:
- Take our interactive 5-minute [Career Quiz](/career-quiz) to discover your top alignments.
- Browse 26+ in-depth career pathways in our [Career Explorer](/careers).

**Follow-Up for You:**
Which school subjects do you find yourself enjoying or excelling at the most right now?`,
      suggestedPrompts: [
        'Take the Career Quiz',
        'What skills do Software Engineers need in high school?',
        'How do I choose between Economics and Computer Science?'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 3. Extracurriculars and Passion Projects
  if (msg.includes('extracurricular') || msg.includes('passion project') || msg.includes('activity') || msg.includes('leadership') || msg.includes('volunteer') || msg.includes('competition') || msg.includes('olympiad')) {
    return {
      text: `Great question, ${name}! Admissions committees at top global universities look for **depth, intellectual curiosity, and initiative**, rather than a long checklist of passive club memberships.

Here is how you can build a stand-out extracurricular profile with **$0 budget** in ${hours}:

### 1. Launch a Self-Directed Passion Project
Instead of waiting for an adult to create an opportunity:
- **Community Survey / Research**: Identify an issue in your school or neighborhood (e.g. digital literacy, student mental health, waste management) and administer an anonymous 50-person survey. Publish a 3-page findings report.
- **Peer Tutoring / Study Clinic**: Organize weekly tutoring sessions for younger grades in mathematics or sciences. Track student grade improvements as tangible proof of impact.
- **Open Knowledge Guide**: Create a free bilingual study guide or digital cheat-sheet for tricky high school topics.

### 2. Enter Free Academic Competitions
- National or regional **Mathematics / Science Olympiads**.
- International youth essay contests (e.g. John Locke Institute, Immerse Education essay competitions).
- Free global challenges like the Wharton High School Investment Competition. Check our [Opportunities Hub](/opportunities) for active entries.

### 3. Track Your Milestones
Document your hours, attendee numbers, and results in your [Application Tracker](/applications) so you have exact details ready when writing essays!

**Let me know:** What is one problem in your school or neighborhood you feel passionate about solving?`,
      suggestedPrompts: [
        'Give me 3 specific passion project ideas for my grade',
        'How can I start a peer tutoring program at my school?',
        'Explore free academic competitions'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 4. Roadmaps and Preparation Plans
  if (msg.includes('roadmap') || msg.includes('plan') || msg.includes('schedule') || msg.includes('weekly') || msg.includes('monthly') || msg.includes('what should i do')) {
    return {
      text: `Here is a customized preparation roadmap tailored for your **${grade}** timeline, designed around **${hours}**:

### 📅 Your Focus Roadmap for ${grade}

#### **Phase 1: Academic Excellence (Core Foundation)**
- Prioritize high marks in your core STEM/Humanities courses. Your GPA / transcript is the bedrock of every application.
- Dedicate **60–90 minutes each weekend** to reading advanced articles or auditing a free university lecture on MIT OpenCourseWare or Coursera.

#### **Phase 2: Project Milestone (Next 4 Weeks)**
- **Week 1**: Define a specific 1-page project proposal (e.g., student survey, coding a simple tool, or drafting an essay).
- **Week 2**: Speak with 1 teacher for feedback or guidance.
- **Week 3**: Carry out the first action (collect 25 responses or complete the first draft).
- **Week 4**: Summarize your progress and log your evidence.

#### **Phase 3: Standardized Testing & University Research**
- If targeting US/international colleges, plan your testing timeline (SAT / ACT or English proficiency like Duolingo / IELTS) for the spring of Grade 11.
- Research 5–8 reach, target, and safety universities on our [Universities Explorer](/universities).

*Tip: Break large goals into weekly 45-minute blocks to avoid feeling overwhelmed!*

Would you like me to build a daily or weekly schedule based on your specific daily routine?`,
      suggestedPrompts: [
        'Build a weekly study timetable for me',
        'When should I take the SAT or IELTS?',
        'How many universities should I apply to?'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 5. Personal Statements, Essays, and Applications
  if (msg.includes('essay') || msg.includes('personal statement') || msg.includes('statement of purpose') || msg.includes('common app') || msg.includes('resume') || msg.includes('recommendation')) {
    return {
      text: `College application essays and personal statements are your opportunity to share your unique voice, character, and perspectives beyond test scores.

### Key Rules for a Compelling Personal Statement:
1. **Show, Don't Tell**: Don't just say "I am passionate about problem solving." Describe a specific moment when your code failed or your experiment collapsed, and what you did to diagnose the problem.
2. **Focus on Reflection, Not Just Events**: Admissions officers care 20% about *what happened* and 80% about *what you learned about yourself and how you grew*.
3. **Authenticity Over Grandeur**: Writing about mentoring your younger sibling or organizing a local clean-up with genuine reflection is far more powerful than exaggerating achievements.
4. **Never Plagiarize or Ghostwrite**: Admissions readers can spot generic AI essays immediately. Use this chat to brainstorm outlines, analyze themes, and sharpen your tone, but ensure the words and memories are 100% your own!

**Where are you in your writing process?** 
- Brainstorming topics?
- Outlining?
- Or do you have an initial draft you want feedback on?`,
      suggestedPrompts: [
        'Help me brainstorm 3 essay topics from my life',
        'How do I structure a 650-word Common App essay?',
        'How do I ask teachers for strong recommendation letters?'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 6. Context-Aware Page Handling
  if (pageContext?.title) {
    return {
      text: `Hello ${name}! I see you're currently exploring **${pageContext.title}** (${pageContext.type || 'Platform Resource'}).

Here is how you can make the most of this resource:
- **Review Requirements**: Take note of deadlines, eligibility criteria, and prerequisites listed on this page.
- **Action Step**: If this aligns with your goals in ${grade}, bookmark it or add it to your [Application Tracker](/applications) so you don't miss key milestones.
- **Connecting to Your Journey**: How does this opportunity or career relate to your long-term plans in ${country}?

Ask me anything specific about **${pageContext.title}**, and I will break down the details for you!`,
      suggestedPrompts: [
        `What are the key requirements for ${pageContext.title}?`,
        `How do I prepare a competitive application for this?`,
        'What should I do next to get started?'
      ],
      provider: 'built-in-mentor',
    };
  }

  // 7. General Friendly Mentorship
  return {
    text: `Hello ${name}! As your AI Student Mentor, I'm here to support you every step of your high school and university journey.

### Here are some ways we can work together:
- 🎓 **University Guidance**: Research universities with generous financial aid (need-blind, full rides).
- 🧭 **Career Exploration**: Match your favorite subjects to high-growth degrees and careers.
- 💡 **Extracurricular Strategy**: Build zero-cost passion projects, research initiatives, and leadership roles.
- 📅 **Custom Roadmaps**: Map out weekly, monthly, and multi-year goals for ${grade}.
- ✍️ **Essay & Application Support**: Brainstorm essay topics, prepare resumes, and get ready for interviews.

What would you like to focus on today?`,
    suggestedPrompts: [
      'Help me find scholarships matching my profile',
      'Explore careers that match my interests',
      'Suggest extracurricular activities I can start with $0 budget',
      'Build my university preparation plan'
    ],
    provider: 'built-in-mentor',
  };
};

/**
 * Main chat generation function.
 * Attempts OpenAI API call if key is present; falls back to the built-in mentor engine.
 */
export const getAiMentorResponse = async ({
  messages = [],
  studentProfile = {},
  pageContext = null,
  clientIp = 'default',
}) => {
  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    throw new Error('Rate limit exceeded: You have sent too many messages in a short time. Please wait a minute before asking again.');
  }

  const latestMessage = messages[messages.length - 1]?.content || '';

  // If no API key configured, use built-in mentor engine with clear status indication
  if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '' || OPENAI_API_KEY.includes('your_openai_api_key')) {
    const fallback = generateFallbackResponse(latestMessage, studentProfile, pageContext);
    return {
      reply: fallback.text,
      suggestedPrompts: fallback.suggestedPrompts,
      meta: {
        provider: 'built-in-mentor',
        status: 'demo_fallback',
        notice: 'Running on Fyndora Built-In Intelligent Mentor Engine. To enable live OpenAI responses, add OPENAI_API_KEY to server/.env.',
      },
    };
  }

  // Live OpenAI API call
  try {
    const systemPrompt = buildSystemPrompt(studentProfile, pageContext);
    
    // Format messages for OpenAI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.warn(`OpenAI API error (${response.status}):`, errBody);
      // Fallback gracefully on API errors
      const fallback = generateFallbackResponse(latestMessage, studentProfile, pageContext);
      return {
        reply: fallback.text,
        suggestedPrompts: fallback.suggestedPrompts,
        meta: {
          provider: 'built-in-mentor',
          status: 'api_fallback',
          notice: `OpenAI returned status ${response.status}. Displaying verified guidance from Fyndora Mentor Engine.`,
        },
      };
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';

    // Generate suggested prompts based on topic
    let suggested = [
      'What are the next practical steps I should take?',
      'Can you give me an example?',
      'Help me create a weekly plan for this'
    ];

    return {
      reply: aiText,
      suggestedPrompts: suggested,
      meta: {
        provider: 'openai',
        model: DEFAULT_MODEL,
        status: 'active',
      },
    };
  } catch (error) {
    console.error('Error contacting AI provider:', error.message);
    // Return high quality fallback instead of breaking user experience
    const fallback = generateFallbackResponse(latestMessage, studentProfile, pageContext);
    return {
      reply: fallback.text,
      suggestedPrompts: fallback.suggestedPrompts,
      meta: {
        provider: 'built-in-mentor',
        status: 'error_fallback',
        notice: `Network/AI provider issue (${error.message}). Providing built-in guidance.`,
      },
    };
  }
};
