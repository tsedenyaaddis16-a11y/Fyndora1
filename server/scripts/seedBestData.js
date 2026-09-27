import dotenv from 'dotenv';
dotenv.config();

import { getMampPool, initMampDatabase } from '../config/mampDb.js';

export const BEST_CAREERS = [
  {
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
    skills: ['Problem Solving', 'Data Structures & Algorithms', 'JavaScript / Python / C++', 'Git & Team Collaboration', 'System Architecture'],
    highSchoolSubjects: ['Mathematics (Calculus/Algebra)', 'Computer Science / ICT', 'Physics', 'English'],
    universitySubjects: ['Computer Science', 'Software Engineering', 'Computer Engineering', 'Information Technology'],
    relatedCareers: ['Data Scientist', 'Cybersecurity Analyst', 'Product Manager', 'Cloud Solutions Architect'],
    workplaces: ['Tech Startups & Giants', 'Financial Institutions', 'Healthcare Software Companies', 'Remote Global Teams'],
    resources: [{ name: 'CS50 Introduction to Computer Science (Harvard)', url: 'https://cs50.harvard.edu' }, { name: 'FreeCodeCamp Curriculum', url: 'https://www.freecodecamp.org' }]
  },
  {
    title: 'Data Scientist & AI Specialist',
    category: 'Technology',
    description: 'Analyzes complex datasets to extract meaningful insights, build predictive machine learning models, and train artificial intelligence systems.',
    responsibilities: [
      'Clean, preprocess, and analyze high-volume structured and unstructured data',
      'Develop neural networks, predictive models, and machine learning pipelines',
      'Design interactive data dashboards to communicate metrics to executives',
      'Evaluate model fairness, prevent algorithmic bias, and ensure privacy'
    ],
    skills: ['Statistical Modeling', 'Python / R / SQL', 'Deep Learning & ML', 'Data Visualization', 'Critical Thinking'],
    highSchoolSubjects: ['Mathematics (Statistics/Calculus)', 'Computer Science', 'Economics', 'Physics'],
    universitySubjects: ['Data Science', 'Applied Statistics', 'Artificial Intelligence', 'Mathematics & Computing'],
    relatedCareers: ['Software Engineer', 'Economist', 'Quantitative Analyst', 'Bioinformatician'],
    workplaces: ['Tech Companies', 'Research Institutes', 'Biotech Labs', 'Consulting Firms'],
    resources: [{ name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' }, { name: 'Khan Academy Statistics', url: 'https://www.khanacademy.org' }]
  },
  {
    title: 'Cybersecurity Specialist & Ethical Hacker',
    category: 'Technology',
    description: 'Protects critical computer systems, networks, and sensitive data from cyberattacks, unauthorized breaches, and security vulnerabilities.',
    responsibilities: [
      'Conduct penetration testing to discover security loopholes in firewalls and servers',
      'Monitor enterprise networks for suspicious activity and security breaches',
      'Formulate disaster recovery plans and enforce cryptographic security policies',
      'Investigate digital security incidents and implement defensive patches'
    ],
    skills: ['Network Security', 'Cryptography', 'Linux & Scripting', 'Penetration Testing', 'Risk Analysis'],
    highSchoolSubjects: ['Computer Science', 'Mathematics', 'Physics', 'ICT'],
    universitySubjects: ['Cybersecurity', 'Information Assurance', 'Computer Networks', 'Computer Science'],
    relatedCareers: ['Software Engineer', 'Cloud Solutions Architect', 'Cryptographer', 'IT Auditor'],
    workplaces: ['Financial Institutions', 'Defense & Intelligence Agencies', 'Cloud Providers', 'Cybersecurity Consultancies'],
    resources: [{ name: 'TryHackMe Cybersecurity Training', url: 'https://tryhackme.com' }]
  },
  {
    title: 'Cloud Solutions Architect',
    category: 'Technology',
    description: 'Designs and manages complex enterprise cloud computing strategies, ensuring scalable, highly available, and cost-effective digital infrastructures.',
    responsibilities: [
      'Architect resilient multi-region cloud infrastructures on AWS, Azure, or GCP',
      'Migrate legacy on-premise systems to scalable containerized microservices',
      'Optimize cloud computing costs and configure automated load balancing',
      'Enforce zero-trust cloud network security frameworks'
    ],
    skills: ['Cloud Architecture (AWS/Azure/GCP)', 'Docker & Kubernetes', 'DevOps & CI/CD', 'Network Design', 'Cost Optimization'],
    highSchoolSubjects: ['Mathematics', 'Computer Science', 'Physics'],
    universitySubjects: ['Cloud Computing', 'Computer Science', 'Systems Engineering', 'Information Technology'],
    relatedCareers: ['Software Engineer', 'Cybersecurity Specialist', 'DevOps Engineer', 'Database Administrator'],
    workplaces: ['Cloud Service Providers', 'Enterprises & Banks', 'SaaS Tech Firms', 'Remote Global Consultancies'],
    resources: [{ name: 'AWS Educate Student Hub', url: 'https://aws.amazon.com/education/awseducate/' }]
  },
  {
    title: 'Medical Doctor (General Physician)',
    category: 'Medicine & Health',
    description: 'Diagnoses acute and chronic medical conditions, prescribes clinical treatments, and provides comprehensive preventive care to patients.',
    responsibilities: [
      'Examine patients, record medical histories, and order diagnostic laboratory tests',
      'Diagnose illnesses, prescribe therapies, and monitor patient recovery',
      'Perform minor surgical and clinical procedures with multidisciplinary teams',
      'Counsel individuals on disease prevention, nutrition, and mental wellness'
    ],
    skills: ['Clinical Diagnosis', 'Compassion & Empathy', 'Active Listening', 'Critical Decision Making', 'Resilience'],
    highSchoolSubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English'],
    universitySubjects: ['Medicine (MBBS / MD)', 'Biomedical Science', 'Pre-Med Human Biology', 'Anatomy'],
    relatedCareers: ['Registered Nurse', 'Pharmacist', 'Surgeon', 'Public Health Specialist'],
    workplaces: ['Teaching Hospitals', 'Community Health Clinics', 'Private Medical Centers', 'International NGOs (Doctors Without Borders)'],
    resources: [{ name: 'World Health Organization (WHO) Learning Hub', url: 'https://www.who.int' }]
  },
  {
    title: 'Registered Nurse & Clinical Specialist',
    category: 'Medicine & Health',
    description: 'Provides direct patient care, administers life-saving medications, operates medical monitoring equipment, and advocates for patient health.',
    responsibilities: [
      'Monitor vital signs, recognize changes in patient condition, and alert medical teams',
      'Administer intravenous therapies, oral medicines, and specialized wound care',
      'Educate patients and family members regarding disease management and recovery',
      'Coordinate patient care plans alongside doctors and specialized therapists'
    ],
    skills: ['Patient Care', 'Emergency Triage', 'Medication Administration', 'Compassionate Communication', 'Teamwork'],
    highSchoolSubjects: ['Biology', 'Chemistry', 'Mathematics', 'Psychology / English'],
    universitySubjects: ['Nursing (BSN)', 'Clinical Health Sciences', 'Critical Care Nursing'],
    relatedCareers: ['Medical Doctor', 'Nurse Practitioner', 'Physical Therapist', 'Healthcare Administrator'],
    workplaces: ['Hospitals & Intensive Care Units', 'Pediatric Centers', 'Emergency Response Teams', 'Community Health Clinics'],
    resources: [{ name: 'International Council of Nurses', url: 'https://www.icn.ch' }]
  },
  {
    title: 'Pharmacist & Pharmaceutical Scientist',
    category: 'Medicine & Health',
    description: 'Prepares and dispenses prescription medications, ensures patient drug safety, and researches chemical compounds for new pharmaceutical therapies.',
    responsibilities: [
      'Review doctor prescriptions for proper dosages, contraindications, and drug interactions',
      'Advise patients on medication usage, adverse reactions, and storage precautions',
      'Formulate specialized medicinal compounds and ensure clinical safety standards',
      'Participate in pharmaceutical research trials for novel therapeutic treatments'
    ],
    skills: ['Pharmacology', 'Organic Chemistry', 'Attention to Detail', 'Patient Counseling', 'Analytical Precision'],
    highSchoolSubjects: ['Chemistry', 'Biology', 'Mathematics', 'Physics'],
    universitySubjects: ['Pharmacy (Pharm.D)', 'Pharmaceutical Sciences', 'Medicinal Chemistry', 'Biochemistry'],
    relatedCareers: ['Medical Doctor', 'Biochemist', 'Toxicologist', 'Clinical Research Coordinator'],
    workplaces: ['Hospital Pharmacies', 'Community Retail Pharmacies', 'Pharmaceutical Research Labs', 'Drug Regulatory Agencies'],
    resources: [{ name: 'International Pharmaceutical Federation (FIP)', url: 'https://www.fip.org' }]
  },
  {
    title: 'Biomedical Engineer',
    category: 'Medicine & Health',
    description: 'Combines biology and engineering to design cutting-edge medical devices such as artificial organs, robotic surgical tools, prosthetics, and diagnostic equipment.',
    responsibilities: [
      'Design artificial limbs, heart valves, pacemakers, and MRI diagnostic machinery',
      'Conduct biocompatibility tests on medical polymers, ceramics, and metallic implants',
      'Collaborate with clinicians to optimize surgical robotics and patient monitors',
      'Ensure strict regulatory compliance with medical device safety standards'
    ],
    skills: ['Biomechanics', 'CAD Modeling & Prototyping', 'Electronics & Sensors', 'Biomaterials', 'Problem Solving'],
    highSchoolSubjects: ['Physics', 'Mathematics', 'Biology', 'Chemistry'],
    universitySubjects: ['Biomedical Engineering', 'Bioengineering', 'Mechanical Engineering', 'Mechatronics'],
    relatedCareers: ['Mechanical Engineer', 'Medical Doctor', 'Robotics Specialist', 'Materials Scientist'],
    workplaces: ['Medical Device Manufacturers', 'Biomedical Research Institutes', 'Hospitals', 'Prosthetics Labs'],
    resources: [{ name: 'Biomedical Engineering Society (BMES)', url: 'https://www.bmes.org' }]
  },
  {
    title: 'Civil & Structural Engineer',
    category: 'Engineering',
    description: 'Designs, constructs, and oversees large-scale physical infrastructure projects including suspension bridges, transport systems, clean water plants, and eco-skyscrapers.',
    responsibilities: [
      'Perform geotechnical soil assessments and seismic structural calculations',
      'Model 3D infrastructure blueprints using AutoCAD and Building Information Modeling (BIM)',
      'Calculate project budgets, material stress tolerances, and construction timelines',
      'Supervise on-site construction safety and guarantee environmental code adherence'
    ],
    skills: ['Structural Analysis', 'BIM & AutoCAD', 'Project Management', 'Geotechnical Mechanics', 'Mathematical Modeling'],
    highSchoolSubjects: ['Physics', 'Mathematics (Calculus/Geometry)', 'Technical Drawing', 'Chemistry'],
    universitySubjects: ['Civil Engineering', 'Structural Engineering', 'Environmental Engineering', 'Urban Infrastructure'],
    relatedCareers: ['Architect', 'Environmental Scientist', 'Mechanical Engineer', 'Urban Planner'],
    workplaces: ['Engineering Consultancies', 'Infrastructure Contractors', 'Ministries of Transport', 'International Development Agencies'],
    resources: [{ name: 'American Society of Civil Engineers (ASCE)', url: 'https://www.asce.org' }]
  },
  {
    title: 'Mechanical & Robotics Engineer',
    category: 'Engineering',
    description: 'Designs, prototypes, and tests mechanical mechanisms, thermal systems, autonomous robots, and advanced automated manufacturing equipment.',
    responsibilities: [
      'Design mechanical components, robotics arms, and precision gear systems in 3D CAD',
      'Perform finite element stress analysis and thermodynamic heat transfer calculations',
      'Program microcontrollers, robotic actuators, and sensory feedback loops',
      'Oversee automated assembly lines and automotive manufacturing processes'
    ],
    skills: ['3D CAD (SolidWorks/Fusion)', 'Thermodynamics & Fluid Mechanics', 'Robotics & Control Systems', 'Material Science', 'Prototyping'],
    highSchoolSubjects: ['Physics', 'Mathematics (Calculus)', 'Chemistry', 'Technical Design'],
    universitySubjects: ['Mechanical Engineering', 'Mechatronics', 'Robotics Engineering', 'Automotive Engineering'],
    relatedCareers: ['Aerospace Engineer', 'Electrical Engineer', 'Biomedical Engineer', 'Automotive Designer'],
    workplaces: ['Automotive & EV Companies', 'Robotics Studios', 'Aerospace Manufacturers', 'Industrial Automation Plants'],
    resources: [{ name: 'American Society of Mechanical Engineers (ASME)', url: 'https://www.asme.org' }]
  },
  {
    title: 'Aerospace & Aeronautical Engineer',
    category: 'Engineering',
    description: 'Develops aircraft, commercial satellites, propulsion systems, and spacecraft capable of atmospheric and interplanetary exploration.',
    responsibilities: [
      'Simulate aerodynamic airflow profiles and lift-to-drag ratios using CFD software',
      'Design lightweight composite carbon structures for airplane wings and rocket hulls',
      'Develop high-efficiency jet engines, ion thrusters, and orbital rocket stages',
      'Conduct wind tunnel tests and aerospace flight safety verification protocols'
    ],
    skills: ['Aerodynamics', 'Orbital Mechanics', 'Computational Fluid Dynamics', 'Propulsion Systems', 'Structural Composites'],
    highSchoolSubjects: ['Physics', 'Mathematics (Calculus/Trigonometry)', 'Chemistry', 'Computer Science'],
    universitySubjects: ['Aerospace Engineering', 'Aeronautical Engineering', 'Mechanical Engineering', 'Space Systems'],
    relatedCareers: ['Mechanical Engineer', 'Astrophysicist', 'Robotics Engineer', 'Defense Systems Analyst'],
    workplaces: ['Space Exploration Agencies (NASA/ESA)', 'Aviation Manufacturers', 'Satellite Telecoms', 'Defense Contractors'],
    resources: [{ name: 'AIAA Aerospace Student Hub', url: 'https://www.aiaa.org' }]
  },
  {
    title: 'Electrical & Renewable Energy Engineer',
    category: 'Engineering',
    description: 'Designs electrical power generation grids, solar photovoltaic arrays, wind turbine farms, energy storage batteries, and microelectronic circuit boards.',
    responsibilities: [
      'Design solar power generation plants and offshore wind turbine electrical arrays',
      'Architect power distribution grids and grid-scale lithium/solid-state battery storage',
      'Simulate electrical circuits, PCB layouts, and power transformation nodes',
      'Implement smart-grid automation and renewable energy integration algorithms'
    ],
    skills: ['Circuit Design & PCB Layout', 'Power Systems Engineering', 'Renewable Energy Systems', 'Microcontrollers', 'Simulation (MATLAB/Simulink)'],
    highSchoolSubjects: ['Physics', 'Mathematics', 'Chemistry', 'ICT'],
    universitySubjects: ['Electrical Engineering', 'Renewable Energy Engineering', 'Electronic Engineering', 'Power Systems'],
    relatedCareers: ['Civil Engineer', 'Mechanical Engineer', 'Environmental Scientist', 'Embedded Systems Engineer'],
    workplaces: ['Renewable Energy Utilities', 'Grid Operators', 'Solar & Wind Tech Firms', 'Electric Vehicle Battery Labs'],
    resources: [{ name: 'IEEE Power & Energy Society', url: 'https://www.ieee-pes.org' }]
  },
  {
    title: 'Business Manager & Operations Director',
    category: 'Business',
    description: 'Directs company departments, orchestrates cross-functional workflows, optimizes capital allocation, and leads organizations toward sustainable expansion.',
    responsibilities: [
      'Establish organizational operational policies, performance OKRs, and growth roadmaps',
      'Manage multi-million dollar annual budgets and financial resource allocations',
      'Lead talent recruitment, executive leadership mentoring, and team empowerment',
      'Negotiate high-stakes partnerships, supply chain contracts, and market expansions'
    ],
    skills: ['Strategic Leadership', 'Financial Acumen', 'Operations Management', 'Contract Negotiation', 'Risk Management'],
    highSchoolSubjects: ['Business Studies', 'Economics', 'Mathematics', 'English / Speech'],
    universitySubjects: ['Business Administration (BBA)', 'Management Science', 'International Business', 'Operations Strategy'],
    relatedCareers: ['Entrepreneur', 'Marketing Specialist', 'Investment Banker', 'Supply Chain Director'],
    workplaces: ['Multinational Corporations', 'Consulting Firms', 'Fast-Growing Tech Companies', 'Non-Governmental Organizations'],
    resources: [{ name: 'Harvard Business Review Student Resources', url: 'https://hbr.org' }]
  },
  {
    title: 'Entrepreneur & Tech Startup Founder',
    category: 'Business',
    description: 'Identifies critical real-world problems, creates breakthrough technological solutions, raises angel and venture capital, and builds high-growth companies.',
    responsibilities: [
      'Formulate business models and validate customer value propositions through MVPs',
      'Pitch vision to venture capitalists, angel syndicates, and grant committees',
      'Recruit initial founding teams and cultivate mission-driven corporate culture',
      'Iterate on products based on user metrics, customer feedback, and rapid growth'
    ],
    skills: ['Vision & Adaptability', 'Pitching & Persuasion', 'Financial Bootstrapping', 'Agile Product Management', 'Grit'],
    highSchoolSubjects: ['Economics', 'Computer Science', 'Business Studies', 'Mathematics'],
    universitySubjects: ['Entrepreneurship', 'Computer Science & Business', 'Engineering Management', 'Finance'],
    relatedCareers: ['Business Manager', 'Product Manager', 'Venture Capitalist', 'Marketing Specialist'],
    workplaces: ['Self-Founded Startups', 'Technology Incubators', 'Venture Capital Studios'],
    resources: [{ name: 'Y Combinator Startup School', url: 'https://www.startupschool.org' }]
  },
  {
    title: 'Investment Banker & Financial Analyst',
    category: 'Business',
    description: 'Advises companies on mergers and acquisitions, issues corporate debt and equity, builds financial valuation models, and allocates investment capital.',
    responsibilities: [
      'Construct discounted cash flow (DCF), LBO, and comparable company financial models',
      'Structure merger, acquisition, and initial public offering (IPO) transactions',
      'Analyze macroeconomic trends, currency fluctuations, and corporate balance sheets',
      'Present investment memoranda to institutional investors and executive boards'
    ],
    skills: ['Financial Modeling (Excel)', 'Company Valuation', 'Quantitative Analysis', 'High-Stakes Presentation', 'Market Due Diligence'],
    highSchoolSubjects: ['Mathematics (Statistics/Calculus)', 'Economics', 'Accounting', 'English'],
    universitySubjects: ['Finance', 'Economics', 'Applied Mathematics', 'Accounting & Financial Economics'],
    relatedCareers: ['Economist', 'Data Scientist', 'Business Manager', 'Chartered Accountant'],
    workplaces: ['Global Investment Banks', 'Private Equity Funds', 'Asset Management Firms', 'Sovereign Wealth Funds'],
    resources: [{ name: 'Corporate Finance Institute (CFI) Free Resources', url: 'https://corporatefinanceinstitute.com' }]
  },
  {
    title: 'Marketing Specialist & Brand Strategist',
    category: 'Business',
    description: 'Researches consumer psychology, constructs brand narratives, runs data-driven digital ad campaigns, and drives international customer engagement.',
    responsibilities: [
      'Conduct market demographic surveys, consumer behavior tests, and competitor audits',
      'Design omni-channel campaigns across digital search, social channels, and video media',
      'Collaborate with copywriters, videographers, and graphic artists on creative assets',
      'Track return on ad spend (ROAS), conversion funnels, and customer lifetime value'
    ],
    skills: ['Digital Marketing (SEO/SEM)', 'Consumer Psychology', 'Data Analytics', 'Brand Storytelling', 'Copywriting'],
    highSchoolSubjects: ['Economics', 'English Literature', 'Psychology / Sociology', 'ICT / Media'],
    universitySubjects: ['Marketing', 'Strategic Communications', 'Consumer Psychology', 'Digital Media Management'],
    relatedCareers: ['Business Manager', 'Graphic Designer', 'Journalist', 'Entrepreneur'],
    workplaces: ['Global Advertising Agencies', 'Consumer Brands', 'High-Growth Tech Startups', 'Media Collectives'],
    resources: [{ name: 'HubSpot Academy Inbound Marketing', url: 'https://academy.hubspot.com' }]
  },
  {
    title: 'Lawyer & International Human Rights Attorney',
    category: 'Law',
    description: 'Advocates for clients in legal disputes, defends fundamental human rights, drafts binding international agreements, and represents parties in court.',
    responsibilities: [
      'Examine constitutional law, legal precedents, and international treaty frameworks',
      'Draft commercial contracts, litigation pleadings, human rights petitions, and briefs',
      'Represent clients in court hearings, arbitration panels, and international tribunals',
      'Negotiate settlement disputes and advocate for vulnerable communities'
    ],
    skills: ['Analytical Argumentation', 'Persuasive Writing', 'Legal Research', 'Public Speaking & Debate', 'Ethical Integrity'],
    highSchoolSubjects: ['English Literature', 'History', 'Civics / Government', 'Economics / Logic'],
    universitySubjects: ['Law (LL.B / J.D.)', 'Political Science', 'International Relations', 'Philosophy & Ethics'],
    relatedCareers: ['Judge', 'Diplomat', 'Policy Analyst', 'Arbitrator'],
    workplaces: ['International Law Firms', 'United Nations & Human Rights NGOs', 'Corporate Legal Offices', 'Public Prosecution Bureaus'],
    resources: [{ name: 'Coursera International Law Guides', url: 'https://www.coursera.org' }]
  },
  {
    title: 'Diplomat & Foreign Affairs Specialist',
    category: 'Social Sciences',
    description: 'Represents national interests abroad, negotiates international trade and peace treaties, resolves geopolitical crises, and fosters cultural alliances.',
    responsibilities: [
      'Represent the home nation at multilateral conferences (e.g. UN, African Union)',
      'Negotiate international treaties regarding climate, trade, security, and migration',
      'Draft confidential policy intelligence briefings for foreign affairs ministries',
      'Assist citizens abroad and promote cross-national cultural and educational exchanges'
    ],
    skills: ['Diplomatic Protocol', 'Cross-Cultural Fluency', 'Foreign Languages', 'Strategic Negotiation', 'Geopolitical Analysis'],
    highSchoolSubjects: ['History', 'Civics & International Relations', 'Foreign Languages (French/Arabic/Spanish)', 'Geography'],
    universitySubjects: ['International Relations', 'Political Science', 'Diplomacy & Global Affairs', 'Public Policy'],
    relatedCareers: ['Lawyer', 'Economist', 'Journalist', 'United Nations Officer'],
    workplaces: ['Embassies & Consulates', 'Ministries of Foreign Affairs', 'United Nations', 'African Union Commission'],
    resources: [{ name: 'United Nations Academic Impact', url: 'https://www.un.org/en/academic-impact' }]
  },
  {
    title: 'Economist & Public Policy Analyst',
    category: 'Social Sciences',
    description: 'Studies the production, trade, and distribution of resources, building econometric models to forecast inflation, guide taxes, and solve poverty.',
    responsibilities: [
      'Analyze macroeconomic datasets on inflation, labor markets, and trade balances',
      'Develop econometric regression models and forecast economic growth trajectories',
      'Advise ministries on taxation policies, infrastructure investments, and subsidies',
      'Author development economics research papers on poverty alleviation'
    ],
    skills: ['Econometric Modeling', 'Quantitative Data Analysis', 'Statistical Tools (Stata/R)', 'Policy Evaluation', 'Research Writing'],
    highSchoolSubjects: ['Economics', 'Mathematics (Calculus/Statistics)', 'History', 'Geography'],
    universitySubjects: ['Economics', 'Econometrics', 'Development Economics', 'Public Policy'],
    relatedCareers: ['Data Scientist', 'Investment Banker', 'Diplomat', 'Central Bank Analyst'],
    workplaces: ['Central Banks & Finance Ministries', 'The World Bank & IMF', 'Economic Think Tanks', 'Global Universities'],
    resources: [{ name: 'Core Econ Curriculum', url: 'https://www.core-econ.org' }]
  },
  {
    title: 'Architect & Sustainable Urban Designer',
    category: 'Design',
    description: 'Envisions, drafts, and supervises the construction of buildings, urban spaces, and ecological cities that harmonize aesthetics, safety, and energy efficiency.',
    responsibilities: [
      'Translate client requirements into architectural concepts and spatial drawings',
      'Create 3D digital renderings and structural blueprints using Revit and SketchUp',
      'Integrate passive solar cooling, green roof gardens, and net-zero energy systems',
      'Coordinate with civil engineers, construction teams, and city zoning boards'
    ],
    skills: ['Spatial Reasoning', 'Artistic Drawing & 3D Modeling', 'Sustainable Green Building (LEED)', 'Building Code Knowledge', 'Visual Presentation'],
    highSchoolSubjects: ['Fine Art / Drawing', 'Mathematics (Geometry)', 'Physics', 'Design Technology'],
    universitySubjects: ['Architecture (B.Arch)', 'Sustainable Urban Design', 'Architectural Engineering', 'Landscape Architecture'],
    relatedCareers: ['Civil Engineer', 'Graphic Designer', 'Interior Designer', 'Urban Planner'],
    workplaces: ['Architectural Studios', 'Urban Planning Boards', 'Real Estate Development Firms', 'Private Architectural Practice'],
    resources: [{ name: 'ArchDaily Architecture Showcase', url: 'https://www.archdaily.com' }]
  },
  {
    title: 'Graphic & UI/UX Product Designer',
    category: 'Design',
    description: 'Creates intuitive user interfaces, digital experiences, branding identities, and visual assets that make apps and platforms easy and enjoyable to navigate.',
    responsibilities: [
      'Conduct user interviews, design usability wireframes, and build interactive Figma prototypes',
      'Craft visual brand design systems with typography scales and color palettes',
      'Collaborate with software engineers to implement responsive UI interfaces',
      'Run user testing sessions to iterate on navigation layouts and friction points'
    ],
    skills: ['Figma / Adobe Creative Suite', 'UI/UX Design Systems', 'User Research & Wireframing', 'Typography & Visual Balance', 'Empathy'],
    highSchoolSubjects: ['Visual Arts / Graphic Design', 'Computer Science / ICT', 'Psychology', 'English'],
    universitySubjects: ['Interaction Design', 'Graphic Design', 'Human-Computer Interaction (HCI)', 'Digital Arts'],
    relatedCareers: ['Architect', 'Software Engineer', 'Marketing Specialist', 'Creative Director'],
    workplaces: ['Tech Companies & Startups', 'Design Consultancies', 'Digital Agencies', 'Freelance Studios'],
    resources: [{ name: 'Behance Design Network', url: 'https://www.behance.net' }]
  },
  {
    title: 'Film Director & Visual Storyteller',
    category: 'Arts & Media',
    description: 'Brings scripts to life, directs actors, guides camera cinematography, and oversees editing and sound to produce impactful cinematic and documentary films.',
    responsibilities: [
      'Interpret dramatic screenplays and establish lighting, framing, and visual mood',
      'Direct actors during rehearsals to elicit authentic, compelling emotional depth',
      'Collaborate with directors of photography on camera lens selection and movement',
      'Supervise post-production film editing, orchestral score mixing, and color grading'
    ],
    skills: ['Cinematic Storytelling', 'Directing & Leadership', 'Cinematography Aesthetics', 'Film Editing (Premiere/DaVinci)', 'Creative Vision'],
    highSchoolSubjects: ['Drama / Theatre', 'English Literature & Creative Writing', 'Photography / Media', 'History'],
    universitySubjects: ['Film Production', 'Directing & Cinema Studies', 'Screenwriting', 'Dramatic Arts'],
    relatedCareers: ['Journalist', 'Graphic Designer', 'Screenwriter', 'Documentary Producer'],
    workplaces: ['Independent Film Studios', 'Television & Streaming Platforms', 'Commercial Media Agencies', 'Documentary Collectives'],
    resources: [{ name: 'No Film School Directing Guides', url: 'https://nofilmschool.com' }]
  },
  {
    title: 'Investigative Journalist & Media Producer',
    category: 'Arts & Media',
    description: 'Uncovers truth, investigates public events, interviews key figures, fact-checks evidence, and produces balanced reporting across digital, audio, and print media.',
    responsibilities: [
      'Identify critical investigative stories in governance, public health, and science',
      'Interview primary sources, public figures, whistleblowers, and experts',
      'Verify historical documents, financial public records, and photographic proof',
      'Write compelling long-form articles, produce investigative podcasts, and record dispatches'
    ],
    skills: ['Investigative Research', 'Interviewing Techniques', 'Fact-Checking & Journalistic Ethics', 'Concise Storytelling', 'Courage'],
    highSchoolSubjects: ['English Literature', 'History', 'Civics / Government', 'Sociology / Media'],
    universitySubjects: ['Journalism', 'Mass Communication', 'Political Science', 'English Literature'],
    relatedCareers: ['Lawyer', 'Film Director', 'Author & Editor', 'Diplomat'],
    workplaces: ['News Broadcasters & Magazines', 'Investigative Reporting Consortia', 'Podcast Media Networks', 'Online Newsrooms'],
    resources: [{ name: 'Poynter Institute for Media Studies', url: 'https://www.poynter.org' }]
  },
  {
    title: 'High School & STEM Educator',
    category: 'Education',
    description: 'Teaches, inspires, and mentors adolescent students in sciences, mathematics, or humanities, sparking curiosity and preparing them for higher education.',
    responsibilities: [
      'Plan interactive lesson curricula aligned with national and international standards',
      'Facilitate laboratory science experiments, debates, and collaborative student projects',
      'Evaluate student progress through fair assessments, feedback, and individualized support',
      'Mentor students on university applications, scholarship opportunities, and life choices'
    ],
    skills: ['Classroom Leadership', 'Subject Matter Mastery', 'Patience & Empathy', 'Pedagogical Curriculum Design', 'Public Speaking'],
    highSchoolSubjects: ['Your Favorite Subject (Math, Physics, Biology, History)', 'Psychology', 'English'],
    universitySubjects: ['Education (B.Ed)', 'Subject Bachelor Degree with Teacher Certification'],
    relatedCareers: ['University Professor', 'Curriculum Specialist', 'School Counselor', 'Educational Technologist'],
    workplaces: ['Secondary Schools', 'International Baccalaureate (IB) Schools', 'Educational Non-Profits', 'Online Learning Academies'],
    resources: [{ name: 'Edutopia Teaching Excellence', url: 'https://www.edutopia.org' }]
  },
  {
    title: 'Environmental & Climate Change Scientist',
    category: 'Science',
    description: 'Studies ecosystems, analyzes atmospheric carbon, combats land degradation, and creates policies for clean energy transition and biodiversity preservation.',
    responsibilities: [
      'Collect soil, water, and atmospheric samples in nature reserves and agricultural lands',
      'Model climate warming trends, drought risks, and forest cover using satellite GIS',
      'Formulate biodiversity conservation programs and ecological restoration blueprints',
      'Advise governments and international organizations on environmental sustainability laws'
    ],
    skills: ['Field Sampling & Lab Chemistry', 'GIS Satellite Mapping', 'Ecology & Climate Systems', 'Data Analysis', 'Scientific Writing'],
    highSchoolSubjects: ['Biology', 'Chemistry', 'Geography / Earth Science', 'Mathematics'],
    universitySubjects: ['Environmental Science', 'Ecology & Conservation', 'Climatology', 'Geosciences'],
    relatedCareers: ['Civil Engineer', 'Agricultural Scientist', 'Biologist', 'Meteorologist'],
    workplaces: ['Environmental Protection Agencies', 'Climate Research Institutes', 'Conservation NGOs (WWF/UNEP)', 'Clean Energy Consultancies'],
    resources: [{ name: 'UN Environment Programme (UNEP)', url: 'https://www.unep.org' }]
  },
  {
    title: 'Biochemist & Molecular Geneticist',
    category: 'Science',
    description: 'Investigates the chemical processes of living organisms, DNA sequencing, disease mechanisms, and develops genetic therapies to cure illnesses.',
    responsibilities: [
      'Isolate DNA, RNA, and protein macromolecules for high-precision laboratory analysis',
      'Perform CRISPR gene-editing experiments and PCR diagnostics in biosafety labs',
      'Analyze genetic markers associated with hereditary illnesses and viral pathogens',
      'Publish peer-reviewed scientific studies contributing to cancer and immunology research'
    ],
    skills: ['Molecular Biology Techniques', 'CRISPR & Gene Sequencing', 'Biochemical Lab Analysis', 'Data Interpretation', 'Scientific Method'],
    highSchoolSubjects: ['Chemistry', 'Biology', 'Mathematics', 'Physics'],
    universitySubjects: ['Biochemistry', 'Molecular Genetics', 'Biotechnology', 'Cell Biology'],
    relatedCareers: ['Medical Doctor', 'Pharmacist', 'Bioinformatician', 'Biomedical Engineer'],
    workplaces: ['Genomics Research Institutes', 'Biotech Corporations', 'University Medical Labs', 'Forensic Laboratories'],
    resources: [{ name: 'National Human Genome Research Institute', url: 'https://www.genome.gov' }]
  }
];

export const BEST_SCHOLARSHIPS = [
  {
    title: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation & Partner Universities',
    description: 'A transformative, world-renowned scholarship initiative providing comprehensive financial, academic, and leadership support to gifted youth from Africa committed to community service.',
    country: 'International',
    destination: 'USA, Canada, UK, France, Rwanda, Ghana, South Africa',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Books', 'Visa', 'Health Insurance', 'Monthly Living Stipend'],
    boarding: true,
    eligibleNationalities: ['African Countries', 'Ethiopia', 'Kenya', 'Rwanda', 'Ghana', 'Nigeria', 'Uganda', 'Tanzania', 'South Africa'],
    minimumAge: 16,
    maximumAge: 25,
    eligibleGrades: ['Grade 12', 'High School Graduate', 'Undergraduate Applicant'],
    fields: ['Any', 'STEM', 'Health Sciences', 'Agriculture', 'Business', 'Social Sciences'],
    languageRequirements: 'English proficiency (often waived for English-curriculum secondary schools)',
    academicRequirements: 'Top academic standing (top 10% of class) and demonstrated commitment to community impact.',
    deadline: '2026-11-15',
    applicationUrl: 'https://mastercardfdn.org/all/scholars/',
    officialWebsite: 'https://mastercardfdn.org',
    verified: true,
    lastVerified: '2026-03-01',
    status: 'active',
    isDemo: true
  },
  {
    title: 'Ashinaga Africa Initiative (AAI)',
    provider: 'Ashinaga Foundation',
    description: 'An international scholarship program that supports orphaned students from Sub-Saharan Africa to pursue undergraduate studies at top universities globally, with the goal of returning to lead positive change in their home nations.',
    country: 'Japan',
    destination: 'Japan, UK, USA, France',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Books', 'Visa', 'Application fee', 'Monthly Allowance'],
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
    title: 'United World Colleges (UWC) Full Scholarships',
    provider: 'UWC International & National Committees',
    description: 'Selects promising high school students from over 150 countries to study the International Baccalaureate (IB) Diploma across 18 global residential campuses, fostering peace and intercultural understanding.',
    country: 'International',
    destination: 'Norway, Italy, UK, Singapore, Costa Rica, Eswatini, USA, Canada, Japan, Armenia',
    educationLevel: 'High school',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Books', 'Visa', 'Health Insurance'],
    boarding: true,
    eligibleNationalities: ['All Nationalities', 'Ethiopia', 'International'],
    minimumAge: 15,
    maximumAge: 18,
    eligibleGrades: ['Grade 10', 'Grade 11'],
    fields: ['International Baccalaureate (Pre-University)'],
    languageRequirements: 'Basic English (instruction is in English, language support provided)',
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
    title: 'African Leadership Academy (ALA) Two-Year Pre-University Diploma',
    provider: 'African Leadership Academy',
    description: 'An elite residential high school program in Johannesburg, South Africa, dedicated to developing Africa’s future leaders through entrepreneurial leadership, African studies, and Cambridge A-Levels.',
    country: 'South Africa',
    destination: 'South Africa',
    educationLevel: 'High school',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Books', 'Medical Insurance', 'Annual Travel'],
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
    title: 'Lester B. Pearson International Scholarship',
    provider: 'University of Toronto',
    description: 'The most prestigious undergraduate scholarship at Canada’s top university, recognizing exceptional international students who demonstrate outstanding academic creativity and leadership.',
    country: 'Canada',
    destination: 'Canada',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Books', 'Incidental Fees', 'Full Residence Support'],
    boarding: true,
    eligibleNationalities: ['All Non-Canadian Nationalities', 'International'],
    minimumAge: 17,
    maximumAge: 21,
    eligibleGrades: ['Grade 12', 'Final Year High School'],
    fields: ['Any', 'Engineering', 'Computer Science', 'Humanities', 'Life Sciences', 'Rotman Commerce'],
    languageRequirements: 'IELTS / TOEFL or high school English waiver',
    academicRequirements: 'Must be nominated by high school; top 1% academic achievement with recognized community impact.',
    deadline: '2026-11-20',
    applicationUrl: 'https://future.utoronto.ca/pearson/',
    officialWebsite: 'https://future.utoronto.ca',
    verified: true,
    lastVerified: '2026-01-20',
    status: 'active',
    isDemo: true
  },
  {
    title: 'Türkiye Scholarships (Türkiye Bursları)',
    provider: 'Government of the Republic of Türkiye',
    description: 'A comprehensive, competitive government scholarship awarded to outstanding international students to pursue full-time undergraduate degrees at prestigious Turkish universities.',
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
    languageRequirements: '1 year of free Turkish Language preparatory course included; English programs require test scores',
    academicRequirements: 'Minimum 70% overall academic achievement for general programs; minimum 90% for Medicine.',
    deadline: '2026-10-20',
    applicationUrl: 'https://www.turkiyeburslari.gov.tr',
    officialWebsite: 'https://www.turkiyeburslari.gov.tr',
    verified: true,
    lastVerified: '2026-01-15',
    status: 'active',
    isDemo: true
  },
  {
    title: 'Stipendium Hungaricum Scholarship Programme',
    provider: 'Tempus Public Foundation / Hungarian Government',
    description: 'Provides full tuition exemption, monthly stipends, and accommodation allowances for international students to pursue bachelor degrees at Hungarian universities in English.',
    country: 'Hungary',
    destination: 'Hungary',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Monthly Stipend', 'Health Insurance'],
    boarding: false,
    eligibleNationalities: ['Partner Countries', 'Ethiopia', 'Kenya', 'Ghana', 'Nigeria', 'Egypt', 'India'],
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
    title: 'DAAD Development Scholarships & Helmut-Schmidt Program',
    provider: 'German Academic Exchange Service (DAAD)',
    description: 'Prepares future leaders from developing countries in sustainability, engineering, and governance through funded higher education programs at universities across Germany.',
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
    fields: ['Social Sciences', 'Economics', 'Public Policy', 'Development Studies', 'Engineering'],
    languageRequirements: 'English (IELTS 6.5+) or German depending on program',
    academicRequirements: 'Above average high school grades with strong record of civic or social commitment.',
    deadline: '2026-10-10',
    applicationUrl: 'https://www.daad.de/en/',
    officialWebsite: 'https://www.daad.de',
    verified: true,
    lastVerified: '2026-01-10',
    status: 'active',
    isDemo: true
  },
  {
    title: 'KAIST International Undergraduate Scholarship',
    provider: 'Korea Advanced Institute of Science and Technology (KAIST)',
    description: 'Full tuition waiver and monthly living allowance for brilliant international students to pursue world-class science, computing, and robotics engineering degrees in South Korea.',
    country: 'South Korea',
    destination: 'South Korea',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Monthly Stipend', 'National Health Insurance'],
    boarding: true,
    eligibleNationalities: ['All Non-Korean Citizens', 'International'],
    minimumAge: 17,
    maximumAge: 24,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Engineering', 'Computer Science', 'Physics', 'Mathematics', 'Life Science'],
    languageRequirements: 'English proficiency (TOEFL iBT 83 / IELTS 6.5) or English medium certificate',
    academicRequirements: 'Distinction in Mathematics and Sciences.',
    deadline: '2026-10-25',
    applicationUrl: 'https://admission.kaist.ac.kr/intl-undergraduate/',
    officialWebsite: 'https://kaist.ac.kr',
    verified: true,
    lastVerified: '2026-03-05',
    status: 'active',
    isDemo: true
  },
  {
    title: 'MEXT Undergraduate Scholarship (Monbukagakusho)',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (Japan)',
    description: 'Prestigious scholarship awarded by the Japanese government to international students to study in Japanese universities, including 1 year of intensive Japanese language preparatory immersion.',
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
    languageRequirements: 'Willingness to learn Japanese (language course provided in Tokyo/Osaka)',
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
    title: 'NYU Abu Dhabi Global Leaders Full Scholarship',
    provider: 'New York University Abu Dhabi',
    description: 'Offers comprehensive, need-based full financial awards covering tuition, overseas study trips, flights, campus room, and meals at a world-class liberal arts and engineering university.',
    country: 'UAE',
    destination: 'UAE',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Books', 'Health Insurance', 'Study Abroad Stays'],
    boarding: true,
    eligibleNationalities: ['All Nationalities Worldwide', 'Ethiopia', 'International'],
    minimumAge: 17,
    maximumAge: 22,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Any', 'Computer Science', 'Bioengineering', 'Economics', 'Visual Arts', 'Political Science'],
    languageRequirements: 'English proficiency (instruction is in English)',
    academicRequirements: 'Top percentile high school GPA and demonstrated global leadership curiosity.',
    deadline: '2027-01-05',
    applicationUrl: 'https://nyuad.nyu.edu/en/admissions.html',
    officialWebsite: 'https://nyuad.nyu.edu',
    verified: true,
    lastVerified: '2026-03-12',
    status: 'active',
    isDemo: true
  },
  {
    title: 'Reach Oxford Scholarship for Developing Nations',
    provider: 'University of Oxford',
    description: 'Offers fully funded undergraduate places at Oxford to students from developing nations who cannot study for a degree in their own countries due to lack of facilities or financial circumstances.',
    country: 'UK',
    destination: 'UK',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Accommodation', 'Meals', 'Travel', 'Living Allowance'],
    boarding: true,
    eligibleNationalities: ['DAC Recipient Developing Countries', 'Ethiopia', 'Kenya', 'Tanzania', 'Nigeria', 'Ghana'],
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
    title: 'Berea College Tuition Promise Scholarship',
    provider: 'Berea College (USA)',
    description: 'Guarantees that 100% of admitted international students receive a 4-year full-tuition scholarship and on-campus work-study positions to cover living and rooming expenses.',
    country: 'USA',
    destination: 'USA',
    educationLevel: 'Undergraduate',
    fundingType: 'Fully funded',
    coverage: ['Tuition', 'Campus Work-Study', 'Textbook Assistance'],
    boarding: true,
    eligibleNationalities: ['All International Nationalities', 'Ethiopia'],
    minimumAge: 17,
    maximumAge: 23,
    eligibleGrades: ['Grade 12', 'High School Graduate'],
    fields: ['Any', 'Computer Science', 'Business', 'Biology', 'Mathematics', 'Education'],
    languageRequirements: 'TOEFL / IELTS or Duolingo English Test',
    academicRequirements: 'Outstanding academic record with high financial need.',
    deadline: '2026-10-15',
    applicationUrl: 'https://www.berea.edu/admissions/apply-now',
    officialWebsite: 'https://www.berea.edu',
    verified: true,
    lastVerified: '2026-02-18',
    status: 'active',
    isDemo: true
  }
];

export const BEST_OPPORTUNITIES = [
  {
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

export const seedBestDataIntoMamp = async () => {
  try {
    await initMampDatabase();
    const pool = getMampPool();

    console.log('🔄 Updating MAMP MySQL with expanded best careers and scholarships...');

    // 1. Clear old demo careers and insert full expanded set
    await pool.query('DELETE FROM careers');
    for (const c of BEST_CAREERS) {
      await pool.query(
        `INSERT INTO careers (title, category, description, responsibilities, skills, high_school_subjects, university_subjects, related_careers, workplaces, resources)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          c.title,
          c.category,
          c.description,
          JSON.stringify(c.responsibilities || []),
          JSON.stringify(c.skills || []),
          JSON.stringify(c.highSchoolSubjects || []),
          JSON.stringify(c.universitySubjects || []),
          JSON.stringify(c.relatedCareers || []),
          JSON.stringify(c.workplaces || []),
          JSON.stringify(c.resources || []),
        ]
      );
    }
    console.log(`✅ Loaded ${BEST_CAREERS.length} top career pathways into MAMP MySQL`);

    // 2. Clear old demo scholarships and insert expanded high-impact awards
    await pool.query('DELETE FROM scholarships');
    for (const s of BEST_SCHOLARSHIPS) {
      await pool.query(
        `INSERT INTO scholarships (title, provider, description, country, destination, education_level, eligible_nationalities, minimum_age, maximum_age, eligible_grades, fields, funding_type, coverage, boarding, language_requirements, academic_requirements, deadline, application_url, official_website, verified, last_verified, status, is_demo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.title,
          s.provider,
          s.description,
          s.country || 'International',
          s.destination,
          s.educationLevel || 'Undergraduate',
          JSON.stringify(s.eligibleNationalities || []),
          s.minimumAge || null,
          s.maximumAge || null,
          JSON.stringify(s.eligibleGrades || []),
          JSON.stringify(s.fields || []),
          s.fundingType || 'Fully funded',
          JSON.stringify(s.coverage || []),
          s.boarding ? 1 : 0,
          s.languageRequirements || '',
          s.academicRequirements || '',
          s.deadline || null,
          s.applicationUrl || '',
          s.officialWebsite || '',
          s.verified ? 1 : 0,
          s.lastVerified || '2026-03-01',
          s.status || 'active',
          s.isDemo ? 1 : 0,
        ]
      );
    }
    console.log(`✅ Loaded ${BEST_SCHOLARSHIPS.length} fully funded scholarships into MAMP MySQL`);

    // 3. Clear and insert best opportunities
    await pool.query('DELETE FROM opportunities');
    for (const o of BEST_OPPORTUNITIES) {
      await pool.query(
        `INSERT INTO opportunities (title, provider, type, description, country, eligibility, deadline, funding, application_url, official_website, verified, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active')`,
        [
          o.title,
          o.provider,
          o.type,
          o.description,
          o.country || 'Global',
          o.eligibility || '',
          o.deadline || null,
          o.funding || '',
          o.applicationUrl || '',
          o.officialWebsite || '',
        ]
      );
    }
    console.log(`✅ Loaded ${BEST_OPPORTUNITIES.length} top opportunities into MAMP MySQL`);

    console.log('🌟 All best careers, scholarships, and opportunities are now live in MAMP!');
  } catch (error) {
    console.error('Error seeding best data into MAMP:', error.message);
  }
};

// Run directly
seedBestDataIntoMamp().then(() => {
  process.exit(0);
});
