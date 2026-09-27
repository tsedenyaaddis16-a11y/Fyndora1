// Intelligent Journey Recommendation Engine for Personal University Journey
// Generates realistic, grade-adapted, resource-sensitive suggestions

export const generateUniversityJourney = (uni, profile, progressUpdates = []) => {
  const uniName = uni?.name || 'Target University';
  const grade = profile.grade || 'Grade 11';
  const hours = profile.weeklyHours || '4–6 hours/week';
  const needFree = profile.needFree !== false && (!profile.costConstraint || profile.costConstraint.toLowerCase().includes('free') || profile.costConstraint.includes('$0'));
  
  // Normalize interests and subjects
  const strongest = Array.isArray(profile.strongestSubjects) ? profile.strongestSubjects : [profile.strongestSubjects || 'Mathematics'];
  const favorites = Array.isArray(profile.favoriteSubjects) ? profile.favoriteSubjects : [profile.favoriteSubjects || 'Economics'];
  const allSubjects = [...new Set([...strongest, ...favorites])].map(s => String(s).trim()).filter(Boolean);
  
  const academicInterests = profile.academicInterests || profile.talkingTopics || 'Technology and Economics';
  const careerInterests = profile.careerInterests || 'Technology, Engineering or Business';
  const hobbies = profile.hobbies || profile.passions || 'Coding, reading and problem solving';
  const communityProblems = profile.communityProblems || 'Youth financial literacy and education access';
  const achieved = profile.whatAchieved || 'Consistently strong grades in core subjects';
  const wantToExplore = profile.wantToExplore || 'Hands-on project with real community impact';
  const resources = profile.resources || 'Personal computer and internet';

  const combinedText = `${allSubjects.join(' ')} ${academicInterests} ${careerInterests} ${hobbies} ${wantToExplore}`.toLowerCase();

  // Detect dominant thematic tracks
  const isTech = combinedText.includes('computer') || combinedText.includes('coding') || combinedText.includes('software') || combinedText.includes('tech') || combinedText.includes('math') || combinedText.includes('physics') || combinedText.includes('data');
  const isEcon = combinedText.includes('econ') || combinedText.includes('business') || combinedText.includes('finance') || combinedText.includes('commerce') || combinedText.includes('entrepreneur');
  const isBioHealth = combinedText.includes('bio') || combinedText.includes('chem') || combinedText.includes('health') || combinedText.includes('med') || combinedText.includes('doctor');
  const isHumanities = combinedText.includes('history') || combinedText.includes('politi') || combinedText.includes('law') || combinedText.includes('literat') || combinedText.includes('writ') || combinedText.includes('civic') || combinedText.includes('debate');

  // Check if student updated interests in progress updates (e.g. pivoted from CS to Economics)
  const lastUpdate = progressUpdates && progressUpdates.length > 0 ? progressUpdates[0] : null;
  const hasPivotedToEcon = lastUpdate && (lastUpdate.learned?.toLowerCase().includes('econ') || lastUpdate.changedInterest?.toLowerCase().includes('econ') || lastUpdate.reflection?.toLowerCase().includes('econ'));

  // 1. GENERATE 2–4 INTERESTS TO EXPLORE
  const interestsToExplore = [];

  if (isTech && (isEcon || hasPivotedToEcon)) {
    interestsToExplore.push({
      id: 'area_tech_econ',
      title: 'Quantitative Economics & Financial Technology',
      matchScore: 96,
      whyThis: `You mentioned enjoying ${strongest.join(' & ')} along with an interest in ${careerInterests}, so merging data modeling with economic systems is a natural high-impact crossover.`,
      competencies: ['Statistical Modeling', 'Spreadsheet Analysis', 'Python / Algorithms', 'Survey Research'],
    });
  } else if (isTech) {
    interestsToExplore.push({
      id: 'area_tech_core',
      title: 'Applied Computer Science & Open Digital Solutions',
      matchScore: 94,
      whyThis: `Based on your strengths in ${strongest.join(', ')} and your passion for ${academicInterests}, practical software engineering addresses real computational challenges.`,
      competencies: ['Algorithm Design', 'Web Systems', 'Open-Source Tooling', 'System Architecture'],
    });
  }

  if (isEcon || hasPivotedToEcon) {
    interestsToExplore.push({
      id: 'area_econ_policy',
      title: 'Development Economics & Community Financial Systems',
      matchScore: 92,
      whyThis: `You care about "${communityProblems}" and enjoy ${favorites.join(' & ')}. Exploring practical economics enables you to diagnose local resource allocation.`,
      competencies: ['Economic Data Analysis', 'Microfinance Case Studies', 'Policy Brief Writing', 'Community Outreach'],
    });
  }

  if (isBioHealth) {
    interestsToExplore.push({
      id: 'area_bio_health',
      title: 'Public Health Data & Preventative Community Wellness',
      matchScore: 91,
      whyThis: `Recommended because you indicated interest in biological sciences and healthcare, where local evidence-gathering yields genuine community benefits.`,
      competencies: ['Epidemiological Surveying', 'Scientific Literature Review', 'Community Education', 'Health Communication'],
    });
  }

  if (isHumanities || interestsToExplore.length < 2) {
    interestsToExplore.push({
      id: 'area_civics_writing',
      title: 'Public Policy, Advocacy & Investigative Journalism',
      matchScore: 88,
      whyThis: `Given your communication skills and desire to address community problems, structured investigative writing and policy analysis demonstrate intellectual vitality.`,
      competencies: ['Critical Essay Writing', 'Primary Source Research', 'Qualitative Interviews', 'Public Discourse'],
    });
  }

  if (interestsToExplore.length < 3) {
    interestsToExplore.push({
      id: 'area_data_science',
      title: 'Data Science & Community Informatics',
      matchScore: 89,
      whyThis: `Connecting your academic curiosity with practical tools, analyzing local public datasets requires zero financial budget while building university-level rigor.`,
      competencies: ['Data Cleaning', 'Visualization', 'Logical Reasoning', 'Report Drafting'],
    });
  }

  // 2. RECOMMENDED EXTRACURRICULARS (SPECIFIC, NOT GENERIC!)
  const recommendedExtracurriculars = [];

  if (isTech || isEcon) {
    recommendedExtracurriculars.push({
      id: 'ec_peer_clinic',
      title: 'Peer Mathematics & Logic Problem Clinic',
      category: 'Academic Leadership & Mentorship',
      exactlyWhatToDo: `Rather than passively joining a club, organize a bi-weekly 45-minute peer problem-solving workshop for younger students (Grade 9-10) who struggle with algebra or logic. Prepare 3 challenging real-world word problems each session, walk through proofs on the chalkboard, and compile an archive of worked solutions.`,
      timeCommitment: '2–3 hours/week',
      cost: '$0 (Uses school chalkboard or free Google Docs)',
      whyThis: `You noted strong ability in ${strongest.slice(0, 2).join(' and ')} and past experience helping peers. Teaching others demonstrates mastery and initiative with zero financial cost.`,
      expectedOutcome: 'A bound 12-page student study guide and measurable grade improvements for 8–15 mentored classmates.',
    });

    recommendedExtracurriculars.push({
      id: 'ec_survey_research',
      title: 'High School Student Financial Habit & Economics Audit',
      category: 'Independent Research & Social Inquiry',
      exactlyWhatToDo: `Design a 12-question anonymous questionnaire examining how students in your grade budget lunch allowances, use mobile money (e.g. Telebirr/M-Pesa), or save. Collect 75+ responses across classrooms with administrative permission, analyze the variance using Google Sheets, and write a 4-page whitepaper with recommendations for student financial literacy.`,
      timeCommitment: '3 hours/week (for 6 weeks)',
      cost: '$0 (Free Google Forms or printed handouts)',
      whyThis: `You expressed interest in ${academicInterests} and mentioned ${communityProblems}. Conducting primary research displays intellectual curiosity beyond assigned textbooks.`,
      expectedOutcome: 'A formal research summary presented to your school administration and a student budgeting guide.',
    });
  }

  if (isBioHealth) {
    recommendedExtracurriculars.push({
      id: 'ec_health_literacy',
      title: 'Community Health Awareness Factsheets & Local Translation',
      category: 'Community Scientific Communication',
      exactlyWhatToDo: `Select 3 prevalent local health topics (e.g. water purification, seasonal infectious prevention, or youth nutrition). Summarize peer-reviewed guidelines from WHO / CDC / local health ministries into easy-to-read, one-page bilingual factsheets and distribute them to school families.`,
      timeCommitment: '2–4 hours/week',
      cost: '$0 (Digital sharing or free school bulletin)',
      whyThis: `Aligns with your strength in science and interest in medicine, translating complex scientific knowledge into direct local utility.`,
      expectedOutcome: '3 published health factsheets and an informational Q&A session with school biology teachers.',
    });
  }

  recommendedExtracurriculars.push({
    id: 'ec_free_course_digest',
    title: 'Self-Directed University Lecture Audit & Reading Journal',
    category: 'Unassigned Intellectual Vitality',
    exactlyWhatToDo: `Audit one free foundational university course online (e.g. Harvard CS50, MIT OpenCourseWare 18.01 Single Variable Calculus, or Oxford Podbean lectures). Instead of just watching videos, maintain a weekly public or handwritten learning notebook reviewing each lecture, solving problem sets, and writing a 500-word critical takeaway every Sunday.`,
    timeCommitment: '2–3 hours/week',
    cost: '$0 (100% Free on YouTube, edX audit mode, or MIT OCW)',
    whyThis: `Fits within your ${hours} availability. Top universities value students who seek high-level academic challenge outside their school syllabus.`,
    expectedOutcome: 'A completed 30-entry reading and problem-set journal showing self-driven academic rigor.',
  });

  recommendedExtracurriculars.push({
    id: 'ec_competition_prep',
    title: 'National Academic Olympiad / Challenge Independent Study Group',
    category: 'Academic Rigor & Teamwork',
    exactlyWhatToDo: `Form an informal 3-person study team to solve past exam papers from the National Mathematics Olympiad, Science Fair, or Wharton Global High School Investment Competition. Meet once a week to dissect the hardest problems and draft collaborative solutions.`,
    timeCommitment: '2 hours/week',
    cost: '$0 (Past contest papers are freely available online)',
    whyThis: `Connects your interest in competitions with cooperative learning, building problem-solving resilience tailored to your ${hours} schedule.`,
    expectedOutcome: 'Completion of 5 years of past contest papers and registration in the upcoming qualifying round.',
  });

  // 3. PASSION PROJECT IDEAS (3–5 REALISTIC IDEAS)
  const passionProjects = [
    {
      id: 'proj_1',
      title: 'Youth Financial Literacy & Micro-Economics Community Toolkit',
      whyFits: `You mentioned enjoying ${favorites.join(' & ')}, caring about practical economic challenges, and having ${hours}. This project requires zero budget and delivers immediate local impact.`,
      difficulty: 'Moderate',
      estimatedTime: '6 Weeks (3–4 hrs/week)',
      cost: '$0 (Completely Free — uses free Google Sheets and school classroom)',
      firstSteps: [
        'Draft a 10-question anonymous student survey about daily budgeting, saving habits, and financial knowledge gaps.',
        'Review the questions with an economics or mathematics teacher and receive permission to poll 50+ students.',
        'Synthesize findings in Google Sheets into 3 digestible graphs and draft a 2-page practical budgeting handbook.'
      ],
      possibleOutcome: 'A printed/digital student personal finance handbook and a 40-minute peer workshop conducted during advisory period.',
    },
    {
      id: 'proj_2',
      title: 'Open-Source Local Language STEM Terminology Glossary',
      whyFits: `Connects your technical interest with language and community accessibility. Uses your personal computer and requires no specialized lab.`,
      difficulty: 'Beginner-to-Moderate',
      estimatedTime: '8 Weeks (2–3 hrs/week)',
      cost: '$0 (Uses GitHub, free Google Docs, or Markdown)',
      firstSteps: [
        'Select 100 essential STEM concepts in Mathematics, Physics, and Computing currently lacking clear local explanations.',
        'Write clear, intuitive definitions with local analogies and cross-check accuracy with your high-school teachers.',
        'Publish the repository on GitHub or create a printable PDF guide for high-school students in your district.'
      ],
      possibleOutcome: 'A searchable 100-term open educational glossary shared with 3 regional secondary schools.',
    },
    {
      id: 'proj_3',
      title: 'Community Public Data Dashboard / Local Neighborhood Asset Map',
      whyFits: `Capitalizes on your analytical skills and curiosity about community issues without requiring any funding.`,
      difficulty: 'Moderate',
      estimatedTime: '6 Weeks (3 hrs/week)',
      cost: '$0 (Uses free Google Sheets, Canva, and public city/district records)',
      firstSteps: [
        'Identify a public local challenge (e.g. access to study spaces, public transit stop intervals, or library hours).',
        'Collect observational data over two weekends and interview 15 local residents or students.',
        'Build a simple interactive spreadsheet visualization and write an objective 3-page policy summary.'
      ],
      possibleOutcome: 'An empirical data brief submitted to the local town or school youth committee.',
    },
    {
      id: 'proj_4',
      title: 'Offline Digital Learning Library on USB Drive for Low-Connectivity Peers',
      whyFits: `Designed specifically for students who care about educational equity and have computer access. 100% free using open-license educational resources.`,
      difficulty: 'Moderate',
      estimatedTime: '5 Weeks (2–3 hrs/week)',
      cost: '$0 (Uses free Kiwix offline Wikipedia, Khan Academy lite, and existing flash drives)',
      firstSteps: [
        'Curate verified public domain textbooks, MIT open course notes, and math practice problems into organized folder hierarchies.',
        'Install Kiwix or offline HTML viewers so content runs without requiring active internet connectivity.',
        'Test the package on school computer lab workstations and distribute to 10 peers with limited home internet.'
      ],
      possibleOutcome: 'A tested 16GB offline digital knowledge library adopted by the school library computer terminal.',
    },
  ];

  if (isBioHealth) {
    passionProjects.unshift({
      id: 'proj_bio_survey',
      title: 'Secondary School Sleep, Nutrition & Academic Focus Longitudinal Study',
      whyFits: `Directly engages your curiosity in biology and human health, allowing you to run a scientifically sound behavioral study in your school with $0 cost.`,
      difficulty: 'Moderate',
      estimatedTime: '6 Weeks (2–3 hrs/week)',
      cost: '$0 (Paper survey logs or Google Forms)',
      firstSteps: [
        'Design a 2-week daily habit tracking sheet recording sleep duration, breakfast habits, and afternoon alertness ratings.',
        'Recruit 25 student volunteers across your grade to log daily observations anonymously.',
        'Run correlation analyses in spreadsheets to identify statistically significant patterns between sleep and concentration.'
      ],
      possibleOutcome: 'A formal scientific poster session presented at your school science fair or student assembly.',
    });
  }

  // Ensure 3-5 projects
  const finalPassionProjects = passionProjects.slice(0, 4);

  // 4. HIGH-SCHOOL ROADMAP (ADAPTED TO STUDENT'S ACTUAL GRADE)
  let roadmap = [];
  const normalizedGrade = grade.toLowerCase().includes('9') ? 'Grade 9' :
                          grade.toLowerCase().includes('10') ? 'Grade 10' :
                          grade.toLowerCase().includes('11') ? 'Grade 11' : 'Grade 12';

  if (normalizedGrade === 'Grade 9') {
    roadmap = [
      {
        grade: 'Grade 9',
        phase: 'Explore & Foundation',
        isCurrent: true,
        tagline: 'Discover what makes you curious and build consistent academic habits',
        milestones: [
          'Sample 2–3 diverse clubs or activities (e.g. math club, debate, digital skills)',
          'Establish strong study discipline in core courses (aim for rigorous coursework next year)',
          'Read 1 non-fiction book or audit 1 free online university lecture each month',
          'Learn the basics of one digital tool (Excel analysis, Python, or markdown writing)'
        ]
      },
      {
        grade: 'Grade 10',
        phase: 'Focus & Experiment',
        isCurrent: false,
        tagline: 'Narrow down to 1–2 genuine disciplines and launch your first independent initiative',
        milestones: [
          'Choose 1–2 focal areas that genuinely excite you and step back from low-impact clubs',
          'Launch your first mini passion project (e.g. student survey or glossary)',
          'Participate in regional school olympiads or essay competitions',
          'Build strong relationships with academic subject teachers by asking thoughtful questions'
        ]
      },
      {
        grade: 'Grade 11',
        phase: 'Develop, Lead & Deepen',
        isCurrent: false,
        tagline: 'Deliver tangible outcomes, lead others, and demonstrate intellectual vitality',
        milestones: [
          'Expand your passion project into measurable community or school impact',
          'Take on authentic leadership (mentoring younger students, organizing workshops)',
          'Prepare for standardized tests (SAT/ACT) if applicable to your target university',
          'Research need-blind and fully funded scholarships (Mastercard Foundation, Lester B. Pearson, etc.)'
        ]
      },
      {
        grade: 'Grade 12',
        phase: 'Complete, Document & Apply',
        isCurrent: false,
        tagline: 'Synthesize your discoveries, request recommendations, and submit applications',
        milestones: [
          'Document real deliverables, lessons learned, and reflections in your Journey Portfolio',
          'Secure 2 teacher recommendations from teachers who know your curiosity and character',
          'Draft reflective essays connecting your high-school explorations to future university studies',
          'Submit applications with verified fee waivers and financial aid profiles'
        ]
      }
    ];
  } else if (normalizedGrade === 'Grade 10') {
    roadmap = [
      {
        grade: 'Grade 10',
        phase: 'Explore & Experiment',
        isCurrent: true,
        tagline: 'Define your authentic interests and launch your first independent project',
        milestones: [
          'Narrow down to 1–2 academic fields that truly captivate your curiosity',
          'Launch your chosen passion project (e.g. student financial audit or peer clinic)',
          'Engage with regional competitions or open-source problem sets',
          'Audit free introductory university lectures (MIT OCW, Harvard edX) without pressure'
        ]
      },
      {
        grade: 'Grade 11',
        phase: 'Develop, Lead & Deepen',
        isCurrent: false,
        tagline: 'Scale your project deliverables, mentor peers, and tackle maximum course rigor',
        milestones: [
          'Deliver concrete outcomes from your passion project (reports, handbooks, trained peers)',
          'Assume authentic leadership roles in academic clubs or community initiatives',
          'Maintain high grades in advanced courses available at your school',
          'Register for standardized exams (SAT/ACT) and compile your target university list'
        ]
      },
      {
        grade: 'Grade 12',
        phase: 'Complete, Document & Apply',
        isCurrent: false,
        tagline: 'Synthesize accomplishments and present authentic, reflective applications',
        milestones: [
          'Finalize deliverables and document reflections on what surprised you and what you learned',
          'Request teacher recommendation letters with specific examples of your curiosity',
          'Draft personal statements highlighting self-driven initiative rather than manufactured resumes',
          'Submit early and regular decision applications alongside financial aid documents'
        ]
      }
    ];
  } else if (normalizedGrade === 'Grade 11') {
    roadmap = [
      {
        grade: 'Grade 11',
        phase: 'Develop, Lead & Produce Evidence',
        isCurrent: true,
        tagline: 'The pivotal year for focused intellectual initiative, peer mentorship, and tangible deliverables',
        milestones: [
          'Execute your chosen passion project and record weekly progress in your Journey Evidence tracker',
          'Demonstrate authentic leadership by launching your peer problem clinic or study group',
          'Pursue the highest course rigor in mathematics, sciences, or humanities available at your school',
          'Plan and complete required standardized exams before the start of Grade 12',
          'Examine target university admissions deadlines, testing policies, and need-blind financial aid'
        ]
      },
      {
        grade: 'Grade 12',
        phase: 'Complete, Document & Apply',
        isCurrent: false,
        tagline: 'Consolidate impact, craft honest reflective essays, and submit applications',
        milestones: [
          'Complete final project milestones and present findings to your school or community',
          'Ask two academic subject teachers for recommendation letters early in the autumn semester',
          'Write reflective personal essays focusing on obstacles overcome and self-knowledge gained',
          'Submit Early Action / Regular Decision applications and financial aid documentation'
        ]
      }
    ];
  } else {
    // Grade 12
    roadmap = [
      {
        grade: 'Grade 12',
        phase: 'Complete, Document & Apply',
        isCurrent: true,
        tagline: 'Immediate action: organize past achievements, finish your milestone project, and write reflective essays',
        milestones: [
          'Organize all high school achievements and hours into your Journey Evidence portfolio',
          'Execute a concise 4-week deliverable for your passion project (e.g. complete survey whitepaper)',
          'Request teacher evaluations highlighting your intellectual vitality and problem-solving resilience',
          'Draft authentic application essays centered on what you learned about yourself outside class',
          'Submit applications before university deadlines with CSS Profile / financial aid forms',
          'Prepare for prospective student interviews by discussing real projects you built'
        ]
      }
    ];
  }

  // 5. MONTHLY ACTION PLAN (Interactive small tasks with Not Started -> In Progress -> Completed)
  const actionPlan = [
    {
      id: 'task_1',
      month: 'Month 1',
      title: 'Refine Project Scope & Draft Questionnaire / Outline',
      description: `Draft the initial outline or survey questions for your passion project. Review the draft with your favourite teacher for constructive feedback.`,
      status: 'in_progress', // 'not_started' | 'in_progress' | 'completed'
      whyThis: `Taking one clear 45-minute step prevents overwhelm and fits into your ${hours} schedule.`,
    },
    {
      id: 'task_2',
      month: 'Month 1',
      title: `Verify ${uniName} Academic Coursework Alignment`,
      description: `Review official secondary school prerequisites for ${uniName} and confirm your current semester course load covers required subjects.`,
      status: 'completed',
      whyThis: `Ensures your academic baseline remains your highest priority before adding extra commitments.`,
    },
    {
      id: 'task_3',
      month: 'Month 2',
      title: 'Conduct Peer Problem Clinic or Administer Project Survey',
      description: `Run your first two peer problem-solving sessions or collect 50+ responses to your student questionnaire.`,
      status: 'not_started',
      whyThis: `Transitions your curiosity from passive reading into active, observable collaboration with peers.`,
    },
    {
      id: 'task_4',
      month: 'Month 2',
      title: 'Weekly 1-Hour Reading or Lecture Audit',
      description: `Dedicate 60 minutes every weekend to auditing one free university lecture or reading a non-fiction academic chapter.`,
      status: 'not_started',
      whyThis: `Develops the intellectual vitality that admissions tutors at ${uniName} look for.`,
    },
    {
      id: 'task_5',
      month: 'Month 3',
      title: 'Analyze Data & Compile 3-Page Findings Report',
      description: `Tabulate survey answers or problem clinic results into clean spreadsheet charts and summarize 3 actionable insights.`,
      status: 'not_started',
      whyThis: `Produces tangible, written proof of your independent initiative that you can share with mentors.`,
    },
    {
      id: 'task_6',
      month: 'Month 3',
      title: 'Document Reflection & Update Journey Progress',
      description: `Record what surprised you, what obstacles you overcame, and what you learned in your Journey Progress log.`,
      status: 'not_started',
      whyThis: `Reflection turns activities into genuine personal growth, preparing you naturally for college essays.`,
    },
  ];

  return {
    universitySlug: uni?.slug || 'university',
    universityName: uniName,
    generatedAt: new Date().toISOString(),
    studentSummary: {
      grade,
      age: profile.age || 17,
      strongestSubjects: strongest,
      favoriteSubjects: favorites,
      academicInterests,
      careerInterests,
      weeklyHours: hours,
      needFree,
      resources,
    },
    interestsToExplore,
    recommendedExtracurriculars,
    passionProjects: finalPassionProjects,
    roadmap,
    actionPlan,
    progressUpdates: progressUpdates || [],
  };
};
