// Fyndora Realistic Demo Data
// Verified and formatted for high school students discovering paths & scholarships

export const CAREER_CATEGORIES = [
  'Technology',
  'Medicine & Health',
  'Engineering',
  'Business',
  'Science',
  'Law',
  'Arts & Media',
  'Education',
  'Social Sciences',
  'Design'
];

export const DEMO_CAREERS = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    description: 'Designs, develops, and maintains software applications, operating systems, and network platforms that power modern digital solutions.',
    responsibilities: [
      'Write clean, maintainable, and efficient code in modern programming languages',
      'Collaborate with product designers and project managers to plan new features',
      'Test, debug, and optimize software systems for speed, reliability, and security',
      'Review code written by team members and document system architectures',
      'Integrate APIs and deploy web or mobile applications to cloud infrastructure'
    ],
    skills: [
      'Problem Solving',
      'Algorithms & Data Structures',
      'JavaScript / Python / C++',
      'Team Collaboration',
      'System Architecture',
      'Continuous Learning'
    ],
    highSchoolSubjects: [
      'Mathematics (Calculus/Algebra)',
      'Computer Science or ICT',
      'Physics',
      'English / Communication'
    ],
    universitySubjects: [
      'Computer Science',
      'Software Engineering',
      'Computer Engineering',
      'Information Technology'
    ],
    relatedCareers: ['Data Scientist', 'Cybersecurity Analyst', 'Product Manager', 'Cloud Architect'],
    workplaces: [
      'Tech Giants & Startups',
      'Financial Institutions & Banks',
      'Healthcare & Biotech Companies',
      'Government Agencies & Remote Work'
    ],
    resources: [
      { name: 'CS50: Introduction to Computer Science (Harvard)', url: 'https://cs50.harvard.edu' },
      { name: 'FreeCodeCamp Interactive Curriculum', url: 'https://www.freecodecamp.org' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    description: 'Analyzes complex datasets to extract meaningful insights, build predictive machine learning models, and help organizations make data-driven decisions.',
    responsibilities: [
      'Collect and clean structured and unstructured data from diverse sources',
      'Apply statistical techniques and machine learning algorithms to model patterns',
      'Build interactive dashboards and visualizations to communicate findings',
      'Collaborate with business executives to formulate strategic questions',
      'Continuously validate model accuracy and prevent algorithmic bias'
    ],
    skills: [
      'Statistical Analysis',
      'Python / R / SQL',
      'Machine Learning',
      'Data Visualization (Tableau/PowerBI)',
      'Critical Thinking',
      'Storytelling with Data'
    ],
    highSchoolSubjects: [
      'Mathematics (Statistics & Probability)',
      'Computer Science',
      'Economics',
      'Physics'
    ],
    universitySubjects: [
      'Data Science',
      'Statistics',
      'Mathematics',
      'Computer Science',
      'Applied Analytics'
    ],
    relatedCareers: ['Software Engineer', 'Economist', 'AI Researcher', 'Business Intelligence Analyst'],
    workplaces: [
      'Tech Companies',
      'Research Institutes',
      'Consulting Firms',
      'E-commerce & Retail Corporations'
    ],
    resources: [
      { name: 'Kaggle Learn & Competitions', url: 'https://www.kaggle.com' },
      { name: 'Khan Academy Statistics & Probability', url: 'https://www.khanacademy.org' }
    ]
  },
  {
    id: 'doctor',
    title: 'Medical Doctor (General Physician)',
    category: 'Medicine & Health',
    description: 'Diagnoses illnesses, prescribes treatments, provides preventive healthcare guidance, and promotes wellness for individuals and communities.',
    responsibilities: [
      'Examine patients, review medical histories, and interpret diagnostic tests',
      'Diagnose acute and chronic illnesses and prescribe appropriate therapies',
      'Perform minor clinical procedures and counsel patients on lifestyle health',
      'Collaborate with nurses, specialists, and multidisciplinary healthcare teams',
      'Stay updated with clinical guidelines and medical research'
    ],
    skills: [
      'Empathy & Compassion',
      'Clinical Decision Making',
      'Active Listening',
      'Stamina & Stress Resilience',
      'Attention to Detail',
      'Ethical Judgement'
    ],
    highSchoolSubjects: [
      'Biology',
      'Chemistry',
      'Physics',
      'Mathematics',
      'English'
    ],
    universitySubjects: [
      'Medicine (MBBS / MD)',
      'Biomedical Science',
      'Pre-Med Human Biology',
      'Anatomy & Physiology'
    ],
    relatedCareers: ['Nurse', 'Pharmacist', 'Public Health Specialist', 'Biomedical Researcher'],
    workplaces: [
      'Public & Private Hospitals',
      'Community Health Centers',
      'University Teaching Clinics',
      'International NGOs (e.g., Doctors Without Borders)'
    ],
    resources: [
      { name: 'WHO Health Topics & Guidelines', url: 'https://www.who.int' },
      { name: 'Khan Academy Health & Medicine', url: 'https://www.khanacademy.org/science/health-and-medicine' }
    ]
  },
  {
    id: 'nurse',
    title: 'Registered Nurse',
    category: 'Medicine & Health',
    description: 'Provides direct patient care, administers medications, monitors vital signs, and advocates for patients across clinical and community settings.',
    responsibilities: [
      'Monitor patient symptoms and maintain accurate medical records',
      'Administer medications, intravenous therapies, and wound care',
      'Educate patients and family members on managing illnesses and recovery',
      'Coordinate patient care with physicians and therapists',
      'Respond quickly to emergency and intensive care situations'
    ],
    skills: [
      'Patient Care & Empathy',
      'Critical Observation',
      'Communication',
      'Emotional Resilience',
      'Teamwork',
      'Emergency Response'
    ],
    highSchoolSubjects: [
      'Biology',
      'Chemistry',
      'Mathematics',
      'English / Psychology'
    ],
    universitySubjects: [
      'Nursing (BSN)',
      'Clinical Health Sciences',
      'Community Health Nursing'
    ],
    relatedCareers: ['Doctor', 'Physical Therapist', 'Midwife', 'Healthcare Administrator'],
    workplaces: [
      'Hospitals & Surgical Centers',
      'Clinics & Pediatric Centers',
      'Schools & Nursing Homes',
      'Disaster Relief Organizations'
    ],
    resources: [
      { name: 'International Council of Nurses', url: 'https://www.icn.ch' }
    ]
  },
  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    description: 'Plans, designs, constructs, and maintains physical infrastructures such as bridges, roads, dams, clean water systems, and sustainable buildings.',
    responsibilities: [
      'Conduct site investigations and soil and environmental analysis',
      'Use CAD and structural modeling software to design resilient infrastructure',
      'Estimate project budgets, material specifications, and construction schedules',
      'Supervise on-site construction workers and enforce safety regulations',
      'Ensure compliance with government building codes and sustainability standards'
    ],
    skills: [
      'Structural Analysis',
      'AutoCAD / BIM Software',
      'Project Management',
      'Mathematical Modeling',
      'Problem Solving',
      'Environmental Awareness'
    ],
    highSchoolSubjects: [
      'Physics',
      'Mathematics (Calculus/Geometry)',
      'Chemistry',
      'Technical Drawing / Geography'
    ],
    universitySubjects: [
      'Civil Engineering',
      'Structural Engineering',
      'Environmental Engineering',
      'Urban Planning'
    ],
    relatedCareers: ['Architect', 'Environmental Scientist', 'Mechanical Engineer', 'Urban Planner'],
    workplaces: [
      'Engineering Consulting Firms',
      'Construction Companies',
      'Municipal & Transportation Ministries',
      'Infrastructure Development Agencies'
    ],
    resources: [
      { name: 'American Society of Civil Engineers (ASCE)', url: 'https://www.asce.org' }
    ]
  },
  {
    id: 'architect',
    title: 'Architect',
    category: 'Design',
    description: 'Blends artistic vision with engineering principles to design buildings and physical structures that are functional, safe, aesthetically pleasing, and sustainable.',
    responsibilities: [
      'Meet with clients to determine building requirements, styles, and budgets',
      'Draft preliminary sketches and produce detailed architectural blueprints',
      'Integrate energy-efficient materials and sustainable green building standards',
      'Coordinate with structural engineers, plumbers, and electricians',
      'Visit building sites to verify construction conforms to architectural plans'
    ],
    skills: [
      'Spatial Reasoning',
      'Creativity & Visual Art',
      '3D CAD & Architectural Modeling (Revit/SketchUp)',
      'Building Codes Knowledge',
      'Client Presentation',
      'Attention to Detail'
    ],
    highSchoolSubjects: [
      'Visual Arts / Drawing',
      'Mathematics (Geometry)',
      'Physics',
      'History / Design Technology'
    ],
    universitySubjects: [
      'Architecture (B.Arch)',
      'Architectural Engineering',
      'Interior Architecture',
      'Urban Design'
    ],
    relatedCareers: ['Civil Engineer', 'Graphic Designer', 'Interior Designer', 'Urban Planner'],
    workplaces: [
      'Architectural Design Studios',
      'Urban Planning Agencies',
      'Real Estate Developers',
      'Self-Employed Private Practice'
    ],
    resources: [
      { name: 'ArchDaily Architecture Platform', url: 'https://www.archdaily.com' }
    ]
  },
  {
    id: 'business-manager',
    title: 'Business Manager',
    category: 'Business',
    description: 'Leads departments or organizations, oversees operations, optimizes budgets, and coordinates human and material resources to achieve strategic goals.',
    responsibilities: [
      'Develop organizational goals, operating policies, and growth strategies',
      'Manage departmental budgets, financial allocations, and expense reports',
      'Lead team recruitment, mentoring, and performance evaluation',
      'Identify market opportunities and negotiate contracts with partners',
      'Coordinate cross-functional projects across sales, marketing, and operations'
    ],
    skills: [
      'Strategic Leadership',
      'Financial Literacy',
      'Negotiation & Communication',
      'Risk Management',
      'Operational Efficiency',
      'Decision Making'
    ],
    highSchoolSubjects: [
      'Business Studies',
      'Economics',
      'Mathematics',
      'English / Public Speaking'
    ],
    universitySubjects: [
      'Business Administration (BBA)',
      'Management',
      'International Business',
      'Finance & Accounting'
    ],
    relatedCareers: ['Entrepreneur', 'Marketing Specialist', 'Economist', 'Project Manager'],
    workplaces: [
      'Multinational Corporations',
      'Small & Medium Enterprises (SMEs)',
      'Consulting Firms',
      'Non-Profit Organizations'
    ],
    resources: [
      { name: 'Harvard Business Review Student Resources', url: 'https://hbr.org' }
    ]
  },
  {
    id: 'marketing-specialist',
    title: 'Marketing Specialist',
    category: 'Business',
    description: 'Researches consumer behavior, creates brand messaging, plans advertising campaigns, and drives customer engagement across digital and traditional media.',
    responsibilities: [
      'Research target audience demographics, trends, and competitor actions',
      'Design marketing campaigns across social media, search engines, and email',
      'Collaborate with copywriters and graphic designers on promotional assets',
      'Track campaign conversion rates, ROI, and analytics using data tools',
      'Organize promotional events and manage brand reputation'
    ],
    skills: [
      'Digital Marketing (SEO/SEM)',
      'Creative Content Strategy',
      'Consumer Psychology',
      'Data Analytics',
      'Copywriting',
      'Brand Identity'
    ],
    highSchoolSubjects: [
      'Economics',
      'English Literature & Language',
      'Psychology / Sociology',
      'Media Studies / ICT'
    ],
    universitySubjects: [
      'Marketing',
      'Communications & Public Relations',
      'Consumer Psychology',
      'Digital Media Management'
    ],
    relatedCareers: ['Business Manager', 'Graphic Designer', 'Journalist', 'Entrepreneur'],
    workplaces: [
      'Marketing & Advertising Agencies',
      'Consumer Brands & Retailers',
      'Tech Startups',
      'Media Houses'
    ],
    resources: [
      { name: 'HubSpot Academy Inbound Marketing', url: 'https://academy.hubspot.com' }
    ]
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur & Startup Founder',
    category: 'Business',
    description: 'Identifies unmet needs in the market, develops innovative products or services, secures funding, and builds scalable enterprises.',
    responsibilities: [
      'Formulate business models and validate customer value propositions',
      'Pitch to angel investors, venture capitalists, and grant providers',
      'Assemble core founding teams and foster company culture',
      'Iterate on products based on user feedback and market changes',
      'Navigate legal registrations, financial cash flow, and market launches'
    ],
    skills: [
      'Vision & Resilience',
      'Pitching & Persuasion',
      'Financial Bootstrapping',
      'Agile Product Thinking',
      'Networking',
      'Adaptability'
    ],
    highSchoolSubjects: [
      'Economics',
      'Business Studies',
      'Mathematics',
      'Computer Science or Science Subjects'
    ],
    universitySubjects: [
      'Entrepreneurship',
      'Business Administration',
      'Computer Science or Engineering (Technical founders)',
      'Innovation Management'
    ],
    relatedCareers: ['Business Manager', 'Product Manager', 'Marketing Specialist', 'Economist'],
    workplaces: [
      'Self-Founded Startups',
      'Incubators & Tech Accelerators',
      'Venture Capital Studios'
    ],
    resources: [
      { name: 'Y Combinator Startup School', url: 'https://www.startupschool.org' }
    ]
  },
  {
    id: 'lawyer',
    title: 'Lawyer / Attorney',
    category: 'Law',
    description: 'Advises individuals, businesses, and public bodies on legal obligations, drafts legal agreements, and advocates for clients before courts and regulatory panels.',
    responsibilities: [
      'Analyze legal problems, court precedents, and government statutes',
      'Draft contracts, legal briefs, wills, and litigation documents',
      'Represent clients in civil disputes, criminal trials, or arbitration hearings',
      'Negotiate settlements and dispute resolutions outside of court',
      'Provide compliance advice to ensure ethical and lawful operations'
    ],
    skills: [
      'Analytical Reasoning',
      'Persuasive Writing & Debate',
      'Legal Research',
      'Attention to Subtlety & Language',
      'Ethical Integrity',
      'Negotiation'
    ],
    highSchoolSubjects: [
      'English / Literature',
      'History',
      'Civics / Government',
      'Economics / Logic'
    ],
    universitySubjects: [
      'Law (LL.B / J.D.)',
      'Political Science',
      'Philosophy & Ethics',
      'International Relations'
    ],
    relatedCareers: ['Judge', 'Human Rights Advocate', 'Diplomat', 'Policy Analyst'],
    workplaces: [
      'Private Law Firms',
      'Corporate Legal Departments',
      'Government Prosecution Offices',
      'Human Rights & International Justice NGOs'
    ],
    resources: [
      { name: 'Coursera Introduction to International Law', url: 'https://www.coursera.org' }
    ]
  },
  {
    id: 'economist',
    title: 'Economist',
    category: 'Social Sciences',
    description: 'Studies the production and distribution of resources, goods, and services to forecast economic trends, guide public policy, and advise financial institutions.',
    responsibilities: [
      'Analyze historical economic indicators like inflation, employment, and trade',
      'Develop econometric models and mathematical forecasts',
      'Advise governments on tax policies, currency regulation, and subsidies',
      'Write policy briefs and academic papers on economic development',
      'Evaluate the impact of regulations on market competitiveness'
    ],
    skills: [
      'Econometric Modeling',
      'Quantitative Analysis',
      'Statistical Software (Stata/R)',
      'Critical Thinking',
      'Academic Writing',
      'Policy Evaluation'
    ],
    highSchoolSubjects: [
      'Economics',
      'Mathematics (Calculus & Statistics)',
      'History',
      'Civics / Geography'
    ],
    universitySubjects: [
      'Economics',
      'Econometrics',
      'Applied Mathematics',
      'Public Policy'
    ],
    relatedCareers: ['Data Scientist', 'Business Manager', 'Financial Analyst', 'Policy Researcher'],
    workplaces: [
      'Central Banks & Finance Ministries',
      'International Bodies (World Bank, IMF, UN)',
      'Economic Think Tanks & Universities',
      'Investment Banks'
    ],
    resources: [
      { name: 'Core Econ: The Economy Curriculum', url: 'https://www.core-econ.org' }
    ]
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'Design',
    description: 'Creates visual concepts, illustrations, typography, and layouts to communicate ideas that inspire, inform, and captivate consumers across digital and print media.',
    responsibilities: [
      'Develop branding assets including logos, color palettes, and brand guidelines',
      'Design layouts for websites, digital ads, packaging, and publications',
      'Work with art directors and copywriters to interpret creative briefs',
      'Master design tools such as Adobe Creative Suite and Figma',
      'Present design concepts clearly to clients and incorporate feedback'
    ],
    skills: [
      'Visual Composition & Layout',
      'Typography & Color Theory',
      'Figma / Adobe Illustrator & Photoshop',
      'Creativity & Innovation',
      'Receptiveness to Feedback',
      'Brand Strategy'
    ],
    highSchoolSubjects: [
      'Fine Arts / Visual Arts',
      'Graphic Communication / ICT',
      'English / Literature',
      'Media Studies'
    ],
    universitySubjects: [
      'Graphic Design',
      'Visual Communication',
      'Digital Arts',
      'Interaction Design (UI/UX)'
    ],
    relatedCareers: ['Architect', 'Marketing Specialist', 'UI/UX Designer', 'Film Director'],
    workplaces: [
      'Design Studios & Advertising Agencies',
      'In-House Brand Design Teams',
      'Publishing Houses',
      'Freelance & Creative Collectives'
    ],
    resources: [
      { name: 'Behance Design Showcase & Tutorials', url: 'https://www.behance.net' }
    ]
  },
  {
    id: 'film-director',
    title: 'Film Director / Producer',
    category: 'Arts & Media',
    description: 'Visualizes scripts, guides actors and camera crews, and oversees the creative and dramatic aspects of film, television, and digital video productions.',
    responsibilities: [
      'Interpret screenplays and establish artistic vision and tone',
      'Cast actors and conduct rehearsals to evoke genuine emotional performances',
      'Collaborate with cinematographers on framing, lighting, and camera movement',
      'Supervise post-production editing, sound design, and color grading',
      'Manage production timelines and coordinate diverse creative departments'
    ],
    skills: [
      'Visual Storytelling',
      'Directing Actors',
      'Cinematography Basics',
      'Leadership & Decisiveness',
      'Creative Vision',
      'Post-Production Editing'
    ],
    highSchoolSubjects: [
      'Drama / Theatre Arts',
      'English Literature & Creative Writing',
      'Media Studies / Photography',
      'History'
    ],
    universitySubjects: [
      'Film Production / Cinema Studies',
      'Directing & Screenwriting',
      'Broadcast Media',
      'Dramatic Arts'
    ],
    relatedCareers: ['Journalist', 'Graphic Designer', 'Screenwriter', 'Multimedia Producer'],
    workplaces: [
      'Film Studios & Independent Production Houses',
      'Broadcasting & Streaming Networks',
      'Commercial & Music Video Agencies',
      'Documentary Collectives'
    ],
    resources: [
      { name: 'No Film School Filmmaking Guides', url: 'https://nofilmschool.com' }
    ]
  },
  {
    id: 'journalist',
    title: 'Journalist / News Reporter',
    category: 'Arts & Media',
    description: 'Investigates events, conducts interviews, verifies facts, and crafts compelling news stories across print, television, podcasting, and digital platforms.',
    responsibilities: [
      'Identify timely news stories and conduct thorough investigative research',
      'Interview eyewitnesses, public officials, and subject matter experts',
      'Write balanced, factual, and engaging articles under tight deadlines',
      'Adhere strictly to journalism ethics, libel laws, and truth verification',
      'Produce multimedia content including audio recordings and video dispatches'
    ],
    skills: [
      'Investigative Research',
      'Interviewing Techniques',
      'Clear, Concise Writing',
      'Fact-Checking & Ethics',
      'Speed & Agility',
      'Digital Storytelling'
    ],
    highSchoolSubjects: [
      'English / Literature',
      'History',
      'Civics / Government',
      'Social Studies'
    ],
    universitySubjects: [
      'Journalism',
      'Mass Communication',
      'Political Science',
      'English & Creative Writing'
    ],
    relatedCareers: ['Lawyer', 'Marketing Specialist', 'Film Director', 'Author & Editor'],
    workplaces: [
      'Newspapers & Online Magazines',
      'Television & Radio Broadcasters',
      'Investigative Journalism Organizations',
      'Podcast Networks'
    ],
    resources: [
      { name: 'Poynter Institute for Media Studies', url: 'https://www.poynter.org' }
    ]
  },
  {
    id: 'teacher',
    title: 'High School Educator / Teacher',
    category: 'Education',
    description: 'Educates, inspires, and mentors adolescent students in specific subject areas, preparing them for higher education and meaningful life trajectories.',
    responsibilities: [
      'Plan engaging curriculum lessons aligned with educational standards',
      'Deliver interactive classroom instruction and facilitate discussions',
      'Assess student learning through projects, tests, and homework',
      'Provide individual academic support and emotional guidance to learners',
      'Communicate with parents and administrators regarding student growth'
    ],
    skills: [
      'Classroom Management',
      'Subject Expertise',
      'Patience & Empathy',
      'Curriculum Design',
      'Public Speaking',
      'Mentorship'
    ],
    highSchoolSubjects: [
      'Your Preferred Teaching Subjects (Math, Science, History, Languages)',
      'Psychology',
      'English / Public Speaking'
    ],
    universitySubjects: [
      'Education (B.Ed)',
      'Specific Subject Degree (e.g. B.Sc Mathematics, B.A History) with Teaching Certificate'
    ],
    relatedCareers: ['School Counselor', 'Curriculum Developer', 'University Professor', 'Social Worker'],
    workplaces: [
      'Public & Private Secondary Schools',
      'International Baccalaureate (IB) Schools',
      'Tutoring & Educational Centers',
      'Online Educational Platforms'
    ],
    resources: [
      { name: 'Edutopia Teaching Strategies', url: 'https://www.edutopia.org' }
    ]
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    category: 'Science',
    description: 'Applies biology, chemistry, and earth science to protect ecosystems, study climate change impacts, manage natural resources, and develop conservation policies.',
    responsibilities: [
      'Collect soil, water, and air samples in the field for laboratory analysis',
      'Analyze pollution levels and study biodiversity health in specific habitats',
      'Prepare environmental impact assessments (EIA) for proposed developments',
      'Recommend conservation strategies and carbon reduction solutions',
      'Educate the public and advise governmental agencies on environmental laws'
    ],
    skills: [
      'Field Sampling & Lab Analysis',
      'GIS (Geographic Information Systems)',
      'Data Analysis',
      'Scientific Report Writing',
      'Ecology & Biodiversity Knowledge',
      'Conservation Mindset'
    ],
    highSchoolSubjects: [
      'Biology',
      'Chemistry',
      'Geography / Earth Science',
      'Mathematics'
    ],
    universitySubjects: [
      'Environmental Science',
      'Ecology & Conservation Biology',
      'Geology / Earth Science',
      'Environmental Engineering'
    ],
    relatedCareers: ['Civil Engineer', 'Doctor', 'Agricultural Scientist', 'Climatologist'],
    workplaces: [
      'Environmental Protection Agencies',
      'Conservation & Wildlife NGOs',
      'Scientific Research Institutes',
      'Renewable Energy & Sustainability Consultancies'
    ],
    resources: [
      { name: 'UN Environment Programme (UNEP)', url: 'https://www.unep.org' }
    ]
  }
];

export const DEMO_SCHOLARSHIPS = [
  {
    id: 'mastercard-foundation-scholars',
    title: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation & Partner Universities',
    description: 'A comprehensive scholarship initiative providing transformative education to academically talented young people—primarily from Africa—who have a commitment to giving back to their communities.',
    country: 'International',
    destination: 'USA, Canada, UK, France, Rwanda, Ghana, South Africa',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Books', 'Visa', 'Health Insurance'],
    boarding: true,
    eligibleNationalities: ['African Countries', 'Ethiopia', 'Kenya', 'Rwanda', 'Ghana', 'Nigeria', 'Uganda', 'Tanzania'],
    minimumAge: 16,
    maximumAge: 25,
    eligibleGrades: ['Grade 12', 'High School Graduate', 'Undergraduate Applicant'],
    fields: ['Any', 'STEM', 'Health Sciences', 'Agriculture', 'Business', 'Social Sciences'],
    languageRequirements: 'English proficiency as required by host university (often waived for English-curriculum applicants)',
    academicRequirements: 'Top academic standing (top 10% of graduating class) and demonstrated leadership & community service.',
    deadline: '2026-11-15',
    applicationUrl: 'https://mastercardfdn.org/all/scholars/',
    officialWebsite: 'https://mastercardfdn.org',
    verified: true,
    lastVerified: '2026-03-01',
    status: 'active',
    isDemo: true
  },
  {
    id: 'ashinaga-africa-initiative',
    title: 'Ashinaga Africa Initiative (AAI)',
    provider: 'Ashinaga Foundation',
    description: 'An international scholarship program that supports orphaned students from Sub-Saharan Africa to pursue undergraduate studies at top universities globally, with the goal of returning to lead positive change in their home nations.',
    country: 'Japan',
    destination: 'Japan, UK, USA, France',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Books', 'Visa', 'Application fee'],
    boarding: true,
    eligibleNationalities: ['Sub-Saharan African Countries', 'Ethiopia', 'Kenya', 'Rwanda', 'Uganda', 'Tanzania', 'Zimbabwe', 'Nigeria'],
    minimumAge: 17,
    maximumAge: 22,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Any', 'Technology', 'Engineering', 'Social Sciences', 'Economics'],
    languageRequirements: 'English or French proficiency',
    academicRequirements: 'Completed high school within the last 2 years with superior academic results; must have lost one or both parents.',
    deadline: '2026-10-31',
    applicationUrl: 'https://www.ashinaga.org/en/our-work/ashinaga-africa-initiative/',
    officialWebsite: 'https://www.ashinaga.org',
    verified: true,
    lastVerified: '2026-02-15',
    status: 'active',
    isDemo: true
  },
  {
    id: 'united-world-colleges-uwc',
    title: 'United World Colleges (UWC) Full Scholarships',
    provider: 'UWC International & National Committees',
    description: 'Selects promising high school students from over 150 countries to study the International Baccalaureate (IB) Diploma across 18 global residential campuses, fostering peace and intercultural understanding.',
    country: 'International',
    destination: 'Norway, Italy, UK, Singapore, Costa Rica, Eswatini, USA, Canada, Japan, Armenia',
    educationLevel: 'High school',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Books', 'Visa'],
    boarding: true,
    eligibleNationalities: ['All Nationalities', 'Ethiopia', 'International'],
    minimumAge: 15,
    maximumAge: 18,
    eligibleGrades: ['Grade 10', 'Grade 11'],
    fields: ['International Baccalaureate (Pre-University)'],
    languageRequirements: 'Basic English (instruction is in English, support provided)',
    academicRequirements: 'Strong academic performance, active extracurricular involvement, and high emotional maturity.',
    deadline: '2026-10-15',
    applicationUrl: 'https://www.uwc.org/how-to-apply',
    officialWebsite: 'https://www.uwc.org',
    verified: true,
    lastVerified: '2026-03-10',
    status: 'active',
    isDemo: true
  },
  {
    id: 'african-leadership-academy',
    title: 'African Leadership Academy (ALA) Two-Year Pre-University Diploma',
    provider: 'African Leadership Academy',
    description: 'An elite residential high school program in Johannesburg, South Africa, dedicated to developing Africa’s future leaders through entrepreneurial leadership, African studies, and Cambridge A-Levels.',
    country: 'South Africa',
    destination: 'South Africa',
    educationLevel: 'High school',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Books', 'Medical Insurance'],
    boarding: true,
    eligibleNationalities: ['African Countries', 'Ethiopia', 'All African Citizens'],
    minimumAge: 15,
    maximumAge: 19,
    eligibleGrades: ['Grade 10', 'Grade 11'],
    fields: ['Leadership', 'Cambridge A-Levels', 'African Studies'],
    languageRequirements: 'English proficiency',
    academicRequirements: 'Demonstrated leadership potential, entrepreneurial mindset, and academic excellence in national exams.',
    deadline: '2026-11-30',
    applicationUrl: 'https://www.africanleadershipacademy.org/admissions/',
    officialWebsite: 'https://www.africanleadershipacademy.org',
    verified: true,
    lastVerified: '2026-02-28',
    status: 'active',
    isDemo: true
  },
  {
    id: 'lester-b-pearson-scholarship',
    title: 'Lester B. Pearson International Student Scholarship',
    provider: 'University of Toronto',
    description: 'Recognizes exceptional international students who demonstrate outstanding academic achievement and creativity, and who are recognized as leaders within their school.',
    country: 'Canada',
    destination: 'Canada',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Books', 'Incidental Fees'],
    boarding: true,
    eligibleNationalities: ['All Non-Canadian Nationalities', 'International'],
    minimumAge: 17,
    maximumAge: 21,
    eligibleGrades: ['Grade 12', 'Final Year High School'],
    fields: ['Any', 'Engineering', 'Computer Science', 'Humanities', 'Life Sciences', 'Rotman Commerce'],
    languageRequirements: 'IELTS / TOEFL or high school English medium waiver',
    academicRequirements: 'Must be nominated by high school; top 1% academic standing with impactful community initiatives.',
    deadline: '2026-11-20',
    applicationUrl: 'https://future.utoronto.ca/pearson/',
    officialWebsite: 'https://future.utoronto.ca',
    verified: true,
    lastVerified: '2026-01-20',
    status: 'active',
    isDemo: true
  },
  {
    id: 'turkiye-burslari-scholarships',
    title: 'Türkiye Scholarships (Türkiye Bursları)',
    provider: 'Government of the Republic of Türkiye',
    description: 'A government-funded, competitive scholarship program awarded to outstanding international students to pursue full-time degrees at prestigious Turkish universities.',
    country: 'Turkey',
    destination: 'Turkey',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Visa', 'Health Insurance', 'Monthly Stipend'],
    boarding: true,
    eligibleNationalities: ['All Nationalities', 'Ethiopia', 'International (Non-Turkish)'],
    minimumAge: 17,
    maximumAge: 21,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Any', 'Engineering', 'Medicine', 'Business', 'Social Sciences', 'Humanities'],
    languageRequirements: 'One year of free Turkish Language preparatory course included; English programs require SAT/TOEFL',
    academicRequirements: 'Minimum 70% overall academic achievement for general programs; minimum 90% for Medicine, Dentistry, and Pharmacy.',
    deadline: '2026-10-20',
    applicationUrl: 'https://www.turkiyeburslari.gov.tr',
    officialWebsite: 'https://www.turkiyeburslari.gov.tr',
    verified: true,
    lastVerified: '2026-01-15',
    status: 'active',
    isDemo: true
  },
  {
    id: 'stipendium-hungaricum',
    title: 'Stipendium Hungaricum Scholarship Programme',
    provider: 'Tempus Public Foundation / Hungarian Government',
    description: 'Provides full tuition coverage and allowances for international students to pursue bachelor’s and master’s studies at Hungarian universities in English.',
    country: 'Hungary',
    destination: 'Hungary',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Monthly Stipend', 'Health Insurance'],
    boarding: false,
    eligibleNationalities: ['Eligible Partner Countries', 'Ethiopia', 'Kenya', 'Ghana', 'Nigeria', 'Egypt', 'India'],
    minimumAge: 18,
    maximumAge: 25,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Engineering', 'Computer Science', 'Agriculture', 'Natural Sciences', 'Economics'],
    languageRequirements: 'B2 English proficiency certificate (IELTS/TOEFL/Duolingo or institutional test)',
    academicRequirements: 'High school graduation diploma with strong marks in relevant subjects.',
    deadline: '2027-01-15',
    applicationUrl: 'https://stipendiumhungaricum.hu',
    officialWebsite: 'https://stipendiumhungaricum.hu',
    verified: true,
    lastVerified: '2026-02-05',
    status: 'active',
    isDemo: true
  },
  {
    id: 'daad-development-scholarships',
    title: 'DAAD Helmut-Schmidt Program & Development Scholarships',
    provider: 'German Academic Exchange Service (DAAD)',
    description: 'Prepares future leaders from developing countries in governance, public policy, and sustainability through funded higher education programs in Germany.',
    country: 'Germany',
    destination: 'Germany',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Travel', 'Health Insurance', 'Monthly Stipend'],
    boarding: false,
    eligibleNationalities: ['Developing Countries', 'Ethiopia', 'Sub-Saharan Africa', 'Asia'],
    minimumAge: 18,
    maximumAge: 28,
    eligibleGrades: ['High School Graduate', 'Undergraduate Applicant'],
    fields: ['Social Sciences', 'Economics', 'Public Policy', 'Development Studies'],
    languageRequirements: 'English (IELTS 6.5+) or German depending on course',
    academicRequirements: 'Above average high school/pre-university grades with civic commitment.',
    deadline: '2026-10-10',
    applicationUrl: 'https://www.daad.de/en/',
    officialWebsite: 'https://www.daad.de',
    verified: true,
    lastVerified: '2026-01-10',
    status: 'active',
    isDemo: true
  },
  {
    id: 'kaist-undergraduate-scholarship',
    title: 'KAIST International Undergraduate Scholarship',
    provider: 'Korea Advanced Institute of Science and Technology (KAIST)',
    description: 'Full tuition exemption and living allowance for brilliant international students to pursue world-class science, computing, and engineering degrees in South Korea.',
    country: 'South Korea',
    destination: 'South Korea',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Monthly Stipend', 'Health Insurance'],
    boarding: true,
    eligibleNationalities: ['All Non-Korean Citizens', 'International'],
    minimumAge: 17,
    maximumAge: 24,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Engineering', 'Computer Science', 'Physics', 'Mathematics', 'Life Science'],
    languageRequirements: 'English proficiency (TOEFL iBT 83 / IELTS 6.5) or English medium of instruction certificate',
    academicRequirements: 'Top tier performance in Mathematics and Sciences (e.g., A/A* in STEM subjects).',
    deadline: '2026-10-25',
    applicationUrl: 'https://admission.kaist.ac.kr/intl-undergraduate/',
    officialWebsite: 'https://kaist.ac.kr',
    verified: true,
    lastVerified: '2026-03-05',
    status: 'active',
    isDemo: true
  },
  {
    id: 'mext-japanese-undergraduate',
    title: 'MEXT Undergraduate Scholarship (Monbukagakusho)',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (Japan)',
    description: 'Prestigious scholarship awarded by the Japanese government to international students to study in Japanese universities, including 1 year of intensive Japanese language training.',
    country: 'Japan',
    destination: 'Japan',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Travel', 'Monthly Stipend', 'Entrance Exam Fees'],
    boarding: false,
    eligibleNationalities: ['Countries with diplomatic ties to Japan', 'Ethiopia', 'International'],
    minimumAge: 17,
    maximumAge: 24,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Social Sciences', 'Humanities', 'Natural Sciences', 'Engineering', 'Medicine'],
    languageRequirements: 'Willingness to learn Japanese (training provided in Tokyo/Osaka)',
    academicRequirements: 'Passed national embassy screening examinations in Math, English, and Science.',
    deadline: '2026-10-05',
    applicationUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/',
    officialWebsite: 'https://www.studyinjapan.go.jp',
    verified: true,
    lastVerified: '2026-02-12',
    status: 'active',
    isDemo: true
  },
  {
    id: 'rotary-youth-exchange',
    title: 'Rotary Youth Exchange Scholarship',
    provider: 'Rotary International',
    description: 'Long-term high school cultural exchange program where students spend a full academic year living with host families and attending high school in another country.',
    country: 'International',
    destination: 'USA, Germany, France, Japan, Brazil, Australia',
    educationLevel: 'High school',
    fundingType: 'Partially funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Host Family Placement'],
    boarding: true,
    eligibleNationalities: ['All Nationalities with active Rotary Club'],
    minimumAge: 15,
    maximumAge: 19,
    eligibleGrades: ['Grade 10', 'Grade 11'],
    fields: ['High School Cultural Exchange'],
    languageRequirements: 'Basic foreign language enthusiasm; no initial fluency required',
    academicRequirements: 'Good academic standing and demonstrated ambassadorship qualities.',
    deadline: '2026-11-05',
    applicationUrl: 'https://www.rotary.org/en/our-programs/youth-exchanges',
    officialWebsite: 'https://www.rotary.org',
    verified: true,
    lastVerified: '2026-01-30',
    status: 'active',
    isDemo: true
  },
  {
    id: 'oxford-reach-scholarship',
    title: 'Reach Oxford Scholarship for Developing Nations',
    provider: 'University of Oxford',
    description: 'Offers fully funded places at Oxford to undergraduates from low-income countries who cannot study for a degree in their own countries due to lack of facilities or political circumstances.',
    country: 'UK',
    destination: 'UK',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Living Allowance'],
    boarding: true,
    eligibleNationalities: ['DAC Recipient Developing Countries', 'Ethiopia', 'Kenya', 'Tanzania', 'Nigeria'],
    minimumAge: 17,
    maximumAge: 23,
    eligibleGrades: ['Grade 12', 'High School Graduate with A-levels / IB equivalent'],
    fields: ['Any except Medicine', 'Computer Science', 'Economics', 'Law', 'Engineering'],
    languageRequirements: 'Oxford English standard (IELTS 7.5 or equivalent)',
    academicRequirements: 'Must have secured an offer of admission from University of Oxford.',
    deadline: '2026-12-15',
    applicationUrl: 'https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/reach-oxford-scholarship',
    officialWebsite: 'https://www.ox.ac.uk',
    verified: true,
    lastVerified: '2026-02-20',
    status: 'active',
    isDemo: true
  },
  {
    id: 'singapore-a-star-youth',
    title: 'A*STAR Youth Science & Pre-University Award',
    provider: 'Agency for Science, Technology and Research (A*STAR Singapore)',
    description: 'Enables high school students with exceptional mathematics and science talent to study in top junior colleges in Singapore with all expenses covered.',
    country: 'Singapore',
    destination: 'Singapore',
    educationLevel: 'High school',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Medical Allowance'],
    boarding: true,
    eligibleNationalities: ['Asian and Partner Developing Countries', 'International'],
    minimumAge: 14,
    maximumAge: 17,
    eligibleGrades: ['Grade 9', 'Grade 10'],
    fields: ['STEM', 'Mathematics', 'Physics', 'Computing'],
    languageRequirements: 'English proficiency',
    academicRequirements: 'High distinctions in Math and Science olympiads or school exams.',
    deadline: '2026-09-10', // Passed deadline demo example
    applicationUrl: 'https://www.a-star.edu.sg',
    officialWebsite: 'https://www.a-star.edu.sg',
    verified: true,
    lastVerified: '2026-01-05',
    status: 'active',
    isDemo: true
  }
];

export const DEMO_OPPORTUNITIES = [
  {
    id: 'yale-young-global-scholars',
    title: 'Yale Young Global Scholars (YYGS)',
    provider: 'Yale University',
    type: 'Summer Program',
    description: 'An intensive academic summer enrichment program for outstanding high school students from over 150 countries, held on Yale’s historic campus in New Haven, Connecticut.',
    country: 'USA',
    eligibility: 'High school sophomores or juniors (ages 16–18) fluent in English.',
    deadline: '2026-11-10',
    funding: 'Need-based full and partial financial aid covers tuition & boarding',
    applicationUrl: 'https://globalscholars.yale.edu',
    officialWebsite: 'https://globalscholars.yale.edu',
    verified: true,
    status: 'active'
  },
  {
    id: 'rise-global-initiative',
    title: 'Rise Global Winners Initiative',
    provider: 'Schmidt Futures & Rhodes Trust',
    type: 'Fellowship',
    description: 'Finds brilliant 15–17-year-olds globally and provides them with life-long opportunity including need-based scholarships, mentorship, network, and funding for public good projects.',
    country: 'Global',
    eligibility: 'Youth aged 15-17 worldwide who demonstrate brilliance and commitment to others.',
    deadline: '2026-12-01',
    funding: 'Fully funded university tuition, technology package, residential summit',
    applicationUrl: 'https://www.risefortheworld.org',
    officialWebsite: 'https://www.risefortheworld.org',
    verified: true,
    status: 'active'
  },
  {
    id: 'international-science-olympiads',
    title: 'International Science & Math Olympiads (IMO / IPhO / IBO / IOI)',
    provider: 'International Olympiad Committees',
    type: 'Competition',
    description: 'The pinnacle worldwide academic competitions for high school students in mathematics, physics, informatics, and biology.',
    country: 'International',
    eligibility: 'Enrolled secondary school students under 20 selected by national committees.',
    deadline: '2026-10-28',
    funding: 'Host countries cover accommodation, food, and competition fees',
    applicationUrl: 'https://www.imo-official.org',
    officialWebsite: 'https://www.imo-official.org',
    verified: true,
    status: 'active'
  },
  {
    id: 'nyas-junior-academy',
    title: 'The Junior Academy (STEM Innovation Challenge)',
    provider: 'New York Academy of Sciences',
    type: 'Academic Program',
    description: 'Connects students ages 13-17 from around the world to collaborate with STEM mentors on solving global challenges like public health and clean energy.',
    country: 'Virtual / Online',
    eligibility: 'Passionate students ages 13–17 with internet access and basic English.',
    deadline: '2026-10-18',
    funding: '100% Free virtual program with prizes and trip to NYC for winners',
    applicationUrl: 'https://www.nyas.org/junioracademy',
    officialWebsite: 'https://www.nyas.org',
    verified: true,
    status: 'active'
  },
  {
    id: 'google-code-in-open-source',
    title: 'Google Summer of Code (GSoC) & Student Mentorship',
    provider: 'Google Open Source',
    type: 'Internship',
    description: 'A global online program focused on bringing new contributors into open source software development under expert guidance.',
    country: 'Global / Remote',
    eligibility: 'Students aged 18+ or high school seniors turning 18 who write code.',
    deadline: '2027-03-20',
    funding: 'Stipend provided based on purchasing power parity per country',
    applicationUrl: 'https://summerofcode.withgoogle.com',
    officialWebsite: 'https://summerofcode.withgoogle.com',
    verified: true,
    status: 'active'
  },
  {
    id: 'harvard-model-un',
    title: 'Harvard Model United Nations (HMUN)',
    provider: 'Harvard International Relations Council',
    type: 'Conferences',
    description: 'Four-day international relations simulation for high school students in Boston, focusing on diplomacy, debating, and international negotiations.',
    country: 'USA',
    eligibility: 'High school student delegations and faculty advisors.',
    deadline: '2026-11-15',
    funding: 'Need-based financial aid for delegate registration fees',
    applicationUrl: 'https://www.harvardmun.org',
    officialWebsite: 'https://www.harvardmun.org',
    verified: true,
    status: 'active'
  },
  {
    id: 'african-youth-climate-fellowship',
    title: 'African Youth Climate Leadership Fellowship',
    provider: 'Pan-African Youth Climate Network',
    type: 'Leadership Program',
    description: 'Empowers high school and early college youth leaders with project grants and environmental advocacy skills to combat desertification and drought.',
    country: 'Ethiopia & East Africa',
    eligibility: 'Youth aged 15-22 living in East African countries.',
    deadline: '2026-10-22',
    funding: 'Fully funded workshop, travel allowance, and micro-grants up to $1,500',
    applicationUrl: 'https://example.org/climate-fellowship',
    officialWebsite: 'https://example.org',
    verified: true,
    status: 'active'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "When you have free time to learn something on your own, what catches your attention most?",
    categoryField: "interests",
    options: [
      { text: "Building an app, coding, or exploring how gadgets and electronics work", weights: { Technology: 4, Engineering: 3 } },
      { text: "Understanding how the human body cures illnesses or how living systems operate", weights: { 'Medicine & Health': 4, Science: 3 } },
      { text: "Designing buildings, drawing graphics, or creating video animations", weights: { Design: 4, 'Arts & Media': 3 } },
      { text: "Starting a project, trading items, or learning how businesses make money", weights: { Business: 4, 'Social Sciences': 2 } },
      { text: "Debating social policies, human rights, or world history", weights: { Law: 4, 'Social Sciences': 3 } }
    ]
  },
  {
    id: 2,
    question: "Which high school subjects do you naturally enjoy or look forward to the most?",
    categoryField: "subjects",
    options: [
      { text: "Mathematics and Computer Science / ICT", weights: { Technology: 4, Engineering: 3 } },
      { text: "Biology and Chemistry", weights: { 'Medicine & Health': 4, Science: 4 } },
      { text: "Physics, Technical Drawing, and Geometry", weights: { Engineering: 4, Design: 3 } },
      { text: "Economics, Accounting, and Business Studies", weights: { Business: 4, 'Social Sciences': 3 } },
      { text: "Literature, History, Civics, and Languages", weights: { Law: 4, Education: 3, 'Arts & Media': 3 } }
    ]
  },
  {
    id: 3,
    question: "What core element would you prefer your day-to-day work to focus on?",
    categoryField: "working_element",
    options: [
      { text: "Working with People (counseling, teaching, leading, treating)", weights: { 'Medicine & Health': 3, Education: 4, Business: 2 } },
      { text: "Working with Technology & Code (algorithms, machines, digital systems)", weights: { Technology: 4, Engineering: 3 } },
      { text: "Working with Creative Ideas & Art (storytelling, visual aesthetics, design)", weights: { Design: 4, 'Arts & Media': 4 } },
      { text: "Working with Abstract Laws, Data, and Policies (justice, market analysis)", weights: { Law: 4, 'Social Sciences': 3, Technology: 2 } }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to approach and solve difficult problems?",
    categoryField: "problem_solving",
    options: [
      { text: "Through logical step-by-step reasoning, testing hypotheses, and mathematics", weights: { Engineering: 3, Science: 4, Technology: 3 } },
      { text: "Through empathy, deep listening, and diagnosing the personal needs of others", weights: { 'Medicine & Health': 4, Education: 3 } },
      { text: "Through creative experimentation, lateral thinking, and sketching prototypes", weights: { Design: 4, 'Arts & Media': 3 } },
      { text: "Through strategic negotiation, organizing people, and resource allocation", weights: { Business: 4, Law: 3 } }
    ]
  },
  {
    id: 5,
    question: "In group school projects or club activities, what role do you naturally fall into?",
    categoryField: "leadership",
    options: [
      { text: "The Coordinator / Leader who delegates tasks and keeps everyone motivated", weights: { Business: 4, Education: 2 } },
      { text: "The Technical Builder who creates the prototype, presentation, or code", weights: { Technology: 4, Engineering: 3 } },
      { text: "The Creative Director who makes it look visually stunning and compelling", weights: { Design: 4, 'Arts & Media': 3 } },
      { text: "The Researcher & Presenter who gathers rigorous evidence and argues the points", weights: { Law: 3, Science: 3, 'Social Sciences': 3 } }
    ]
  },
  {
    id: 6,
    question: "How important is artistic creativity and visual expression to your ideal future work?",
    categoryField: "creativity",
    options: [
      { text: "Extremely essential — I want to shape visuals, stories, media, or architecture", weights: { Design: 4, 'Arts & Media': 4 } },
      { text: "Moderately important — I like innovative problem-solving rather than pure art", weights: { Technology: 3, Engineering: 3, Business: 2 } },
      { text: "Low priority — I prefer established scientific rigor, clear procedures, or legal precision", weights: { 'Medicine & Health': 3, Law: 4, Science: 3 } }
    ]
  },
  {
    id: 7,
    question: "How comfortable are you with quantitative mathematics and numerical analysis?",
    categoryField: "math",
    options: [
      { text: "Love it — I enjoy complex formulas, calculus, statistics, and numeric patterns", weights: { Engineering: 4, Technology: 3, Science: 3, Business: 2 } },
      { text: "Comfortable with practical math (budgets, basic statistics, measurements)", weights: { Business: 3, 'Medicine & Health': 2, 'Social Sciences': 3 } },
      { text: "Prefer writing, verbal reasoning, visual arts, and interpersonal communication", weights: { Law: 3, 'Arts & Media': 3, Education: 3, Design: 2 } }
    ]
  },
  {
    id: 8,
    question: "Which working environment sounds most energizing to you?",
    categoryField: "work_env",
    options: [
      { text: "A modern tech office, remote laptop workspace, or fast-paced digital startup", weights: { Technology: 4, Business: 2 } },
      { text: "A bustling hospital clinic, healthcare facility, or medical field mission", weights: { 'Medicine & Health': 4 } },
      { text: "A construction site, field research lab, forest, or manufacturing plant", weights: { Engineering: 3, Science: 4 } },
      { text: "A design studio, film set, recording space, or creative workshop", weights: { Design: 4, 'Arts & Media': 4 } },
      { text: "A courtroom, university classroom, embassy, or legislative hall", weights: { Law: 4, Education: 3, 'Social Sciences': 3 } }
    ]
  }
];
